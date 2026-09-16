const cheerio = require('cheerio')
const { buildReport } = require('../../lib/detectors')

const CACHE_TTL_MS = 20 * 60 * 1000
const MAX_BODY_BYTES = 3 * 1024 * 1024
const FETCH_TIMEOUT_MS = 13000
const cache = new Map()

const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^\[::1\]$/,
  /^::1$/
]

function normalizeUrl(rawUrl) {
  const trimmed = (rawUrl || '').trim()
  if (!trimmed) return null
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const parsed = new URL(withProtocol)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return parsed
  } catch {
    return null
  }
}

function isBlockedHost(hostname) {
  return BLOCKED_HOSTNAME_PATTERNS.some((pattern) => pattern.test(hostname))
}

function cacheKey(url) {
  return url.toString()
}

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.storedAt > CACHE_TTL_MS) {
    cache.delete(key)
    return null
  }
  return entry.report
}

function setCached(key, report) {
  cache.set(key, { report, storedAt: Date.now() })
}

async function fetchHtml(targetUrl) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(targetUrl.toString(), {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'WebDesignInspector/1.0 (+structural design report bot)',
        Accept: 'text/html,application/xhtml+xml'
      }
    })

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      return { errorCode: 'NOT_HTML', status: response.status }
    }

    if (response.status === 401 || response.status === 403) {
      return { errorCode: 'FORBIDDEN', status: response.status }
    }
    if (response.status === 404) {
      return { errorCode: 'NOT_FOUND', status: response.status }
    }
    if (response.status >= 400) {
      return { errorCode: 'HTTP_ERROR', status: response.status }
    }

    const reader = response.body.getReader()
    const chunks = []
    let received = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      received += value.length
      if (received > MAX_BODY_BYTES) {
        controller.abort()
        return { errorCode: 'BODY_TOO_LARGE', status: response.status }
      }
      chunks.push(value)
    }

    const html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString('utf-8')
    return { html, finalUrl: response.url || targetUrl.toString(), status: response.status }
  } catch (error) {
    if (error.name === 'AbortError') {
      return { errorCode: 'TIMEOUT', status: null }
    }
    return { errorCode: 'FETCH_FAILED', status: null }
  } finally {
    clearTimeout(timeout)
  }
}

function errorMessage(code) {
  const messages = {
    INVALID_URL: 'URL tidak valid. Periksa kembali format URL yang dimasukkan.',
    BLOCKED_HOST: 'URL ini tidak dapat dianalisis karena mengarah ke alamat internal.',
    TIMEOUT: 'Permintaan melebihi batas waktu. Situs mungkin lambat merespons.',
    FORBIDDEN: 'Situs menolak permintaan (401/403). Kemungkinan ada proteksi bot.',
    NOT_FOUND: 'Halaman tidak ditemukan (404) di URL tersebut.',
    HTTP_ERROR: 'Situs merespons dengan status error.',
    NOT_HTML: 'Konten yang diterima bukan dokumen HTML.',
    BODY_TOO_LARGE: 'Ukuran dokumen terlalu besar untuk dianalisis.',
    FETCH_FAILED: 'Gagal mengambil halaman. Periksa apakah URL dapat diakses publik.',
    METHOD_NOT_ALLOWED: 'Metode permintaan tidak didukung.'
  }
  return messages[code] || 'Terjadi kesalahan yang tidak terduga.'
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED', message: errorMessage('METHOD_NOT_ALLOWED') })
    return
  }

  const rawUrl = req.method === 'POST' ? req.body?.url : req.query?.url

  const targetUrl = normalizeUrl(rawUrl)
  if (!targetUrl) {
    res.status(400).json({ ok: false, code: 'INVALID_URL', message: errorMessage('INVALID_URL') })
    return
  }

  if (isBlockedHost(targetUrl.hostname)) {
    res.status(400).json({ ok: false, code: 'BLOCKED_HOST', message: errorMessage('BLOCKED_HOST') })
    return
  }

  const key = cacheKey(targetUrl)
  const cached = getCached(key)
  if (cached) {
    res.status(200).json(cached)
    return
  }

  const result = await fetchHtml(targetUrl)
  if (result.errorCode) {
    res.status(result.status && result.status < 500 ? result.status : 502).json({
      ok: false,
      code: result.errorCode,
      message: errorMessage(result.errorCode)
    })
    return
  }

  const $ = cheerio.load(result.html)
  const report = buildReport({
    $,
    url: targetUrl.toString(),
    finalUrl: result.finalUrl,
    status: result.status,
    html: result.html
  })

  setCached(key, report)
  res.status(200).json(report)
}
