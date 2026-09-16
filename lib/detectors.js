const HEX_PATTERN = /#(?:[0-9a-fA-F]{3}){1,2}\b/g
const RGB_PATTERN = /rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)/g
const IGNORED_HEX = new Set(['#fff', '#ffffff', '#000', '#000000'])

function normalizeColor(value) {
  return value.trim().toLowerCase()
}

function relativeLuminance(hex) {
  let clean = hex.replace('#', '')
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('')
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255
  const g = parseInt(clean.substring(2, 4), 16) / 255
  const b = parseInt(clean.substring(4, 6), 16) / 255
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function collectStyleText($) {
  const chunks = []
  $('style').each((i, el) => {
    chunks.push($(el).html() || '')
  })
  $('[style]').each((i, el) => {
    chunks.push($(el).attr('style') || '')
  })
  return chunks.join('\n')
}

function detectColors($, themeColorMeta) {
  const styleText = collectStyleText($)
  const found = [...(styleText.match(HEX_PATTERN) || []), ...(styleText.match(RGB_PATTERN) || [])]
  const counts = new Map()

  for (const raw of found) {
    const value = normalizeColor(raw)
    if (IGNORED_HEX.has(value)) continue
    counts.set(value, (counts.get(value) || 0) + 1)
  }

  if (themeColorMeta) {
    const value = normalizeColor(themeColorMeta)
    counts.set(value, (counts.get(value) || 0) + 5)
  }

  const palette = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([value, count]) => ({ value, count }))

  let modeGuess = 'light'
  const hexOnly = palette.filter((p) => p.value.startsWith('#'))
  if (hexOnly.length > 0) {
    const darkest = hexOnly.reduce((min, p) => (relativeLuminance(p.value) < relativeLuminance(min.value) ? p : min))
    const lightest = hexOnly.reduce((max, p) => (relativeLuminance(p.value) > relativeLuminance(max.value) ? p : max))
    modeGuess = relativeLuminance(lightest.value) - relativeLuminance(darkest.value) < 0.35 && relativeLuminance(darkest.value) > 0.4 ? 'dark' : 'light'
  }

  return { palette, modeGuess }
}

const GENERIC_FONT_KEYWORDS = new Set([
  'inherit', 'initial', 'sans-serif', 'serif', 'monospace', 'system-ui',
  'ui-sans-serif', 'ui-serif', 'ui-monospace', '-apple-system', 'blinkmacsystemfont'
])

function cleanFontName(raw) {
  return raw.replace(/["']/g, '').trim()
}

function detectFonts($) {
  const fonts = new Map()

  $('link[href*="fonts.googleapis.com"]').each((i, el) => {
    const href = $(el).attr('href') || ''
    const match = href.match(/family=([^&]+)/)
    if (match) {
      const families = decodeURIComponent(match[1]).split('|')
      for (const entry of families) {
        const name = cleanFontName(entry.split(':')[0]).replace(/\+/g, ' ')
        if (name) fonts.set(name, 'google')
      }
    }
  })

  const styleText = collectStyleText($)
  const fontFaceMatches = styleText.match(/@font-face\s*{[^}]*}/g) || []
  for (const block of fontFaceMatches) {
    const nameMatch = block.match(/font-family\s*:\s*([^;]+);/)
    if (nameMatch) {
      const name = cleanFontName(nameMatch[1])
      if (name) fonts.set(name, 'self-hosted')
    }
  }

  const familyMatches = styleText.match(/font-family\s*:\s*([^;"}]+)/g) || []
  for (const decl of familyMatches) {
    const value = decl.split(':')[1] || ''
    const first = cleanFontName(value.split(',')[0])
    if (first && !GENERIC_FONT_KEYWORDS.has(first.toLowerCase()) && !fonts.has(first)) {
      fonts.set(first, 'css')
    }
  }

  return [...fonts.entries()].map(([name, source]) => ({ name, source }))
}

const MOTION_LIBRARY_PATTERNS = [
  { name: 'AOS', test: /aos(\.min)?\.js|animate-on-scroll/i },
  { name: 'GSAP', test: /gsap(\.min)?\.js|greensock/i },
  { name: 'Anime.js', test: /anime(\.min)?\.js/i },
  { name: 'Lottie', test: /lottie/i },
  { name: 'animate.css', test: /animate\.(min\.)?css/i },
  { name: 'Motion One', test: /motion(\.min)?\.js|@motionone/i },
  { name: 'Framer Motion', test: /framer-motion/i }
]

function detectMotion($) {
  const sources = []
  $('script[src]').each((i, el) => sources.push($(el).attr('src') || ''))
  $('link[href]').each((i, el) => sources.push($(el).attr('href') || ''))

  const libraries = []
  for (const lib of MOTION_LIBRARY_PATTERNS) {
    if (sources.some((src) => lib.test.test(src))) {
      libraries.push({ name: lib.name, confidence: 'high' })
    }
  }

  const hasAosAttr = $('[data-aos]').length > 0
  if (hasAosAttr && !libraries.some((l) => l.name === 'AOS')) {
    libraries.push({ name: 'AOS', confidence: 'medium' })
  }
  const hasAnimateClass = $('[class*="animate__"]').length > 0
  if (hasAnimateClass && !libraries.some((l) => l.name === 'animate.css')) {
    libraries.push({ name: 'animate.css', confidence: 'medium' })
  }
  const hasFramerAttr = $('[class*="framer-"]').length > 0
  if (hasFramerAttr && !libraries.some((l) => l.name === 'Framer Motion')) {
    libraries.push({ name: 'Framer Motion', confidence: 'medium' })
  }

  const styleText = collectStyleText($)
  const cssSignals = []
  if (/@keyframes/.test(styleText)) cssSignals.push('@keyframes')
  if (/animation\s*:/.test(styleText)) cssSignals.push('animation')
  if (/transition\s*:/.test(styleText)) cssSignals.push('transition')
  if (/scroll-timeline/.test(styleText)) cssSignals.push('scroll-timeline')

  return { libraries, cssSignals }
}

const STACK_SCRIPT_PATTERNS = [
  { name: 'Next.js', test: /_next\/static/i, confidence: 'high' },
  { name: 'Nuxt', test: /_nuxt\/|__nuxt/i, confidence: 'high' },
  { name: 'WordPress', test: /wp-content|wp-includes/i, confidence: 'high' },
  { name: 'Shopify', test: /cdn\.shopify\.com/i, confidence: 'high' },
  { name: 'Squarespace', test: /squarespace/i, confidence: 'high' },
  { name: 'Wix', test: /wixstatic\.com|wix\.com/i, confidence: 'high' },
  { name: 'Webflow', test: /webflow\.(js|io)/i, confidence: 'high' }
]

function detectStack($) {
  const sources = []
  $('script[src]').each((i, el) => sources.push($(el).attr('src') || ''))
  $('link[href]').each((i, el) => sources.push($(el).attr('href') || ''))

  const stack = []
  for (const pattern of STACK_SCRIPT_PATTERNS) {
    if (sources.some((src) => pattern.test.test(src))) {
      stack.push({ name: pattern.name, confidence: pattern.confidence })
    }
  }

  const generator = $('meta[name="generator"]').attr('content')
  if (generator) {
    stack.push({ name: generator.trim(), confidence: 'high' })
  }

  if ($('#__next').length > 0 && !stack.some((s) => s.name === 'Next.js')) {
    stack.push({ name: 'Next.js', confidence: 'medium' })
  }
  if ($('#root').length > 0 && !stack.some((s) => s.name.toLowerCase().includes('react'))) {
    stack.push({ name: 'React', confidence: 'medium' })
  }
  if ($('[id="app"]').length > 0 || $('[data-v-app]').length > 0) {
    stack.push({ name: 'Vue', confidence: 'medium' })
  }

  const classText = []
  $('[class]').each((i, el) => classText.push($(el).attr('class') || ''))
  const joinedClasses = classText.join(' ')

  const tailwindHits = (joinedClasses.match(/\b(flex|grid|px-\d|py-\d|gap-\d|bg-\w+-\d{2,3}|text-\w+-\d{2,3}|rounded-\w+)\b/g) || []).length
  if (tailwindHits > 15) {
    stack.push({ name: 'Tailwind CSS', confidence: tailwindHits > 40 ? 'high' : 'medium' })
  }

  const bootstrapHits = (joinedClasses.match(/\b(container-fluid|btn btn-|row|col-\d{1,2})\b/g) || []).length
  if (bootstrapHits > 5) {
    stack.push({ name: 'Bootstrap', confidence: bootstrapHits > 15 ? 'high' : 'medium' })
  }

  const uniqueStack = []
  const seen = new Set()
  for (const entry of stack) {
    const key = entry.name.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      uniqueStack.push(entry)
    }
  }

  return uniqueStack
}

function detectLayout($) {
  const signals = []
  const landmarks = {
    header: $('header').length,
    nav: $('nav').length,
    main: $('main').length,
    footer: $('footer').length
  }
  signals.push(`Landmark: header(${landmarks.header}) nav(${landmarks.nav}) main(${landmarks.main}) footer(${landmarks.footer})`)

  const viewport = $('meta[name="viewport"]').attr('content')
  signals.push(viewport ? `Meta viewport ditemukan: ${viewport}` : 'Meta viewport tidak ditemukan')

  const cardLike = $('[class*="card"]').length
  if (cardLike > 0) {
    signals.push(`Pola card-like berulang terdeteksi (${cardLike} elemen)`)
  }

  const styleText = collectStyleText($)
  const radiusHits = (styleText.match(/border-radius/g) || []).length
  const shadowHits = (styleText.match(/box-shadow/g) || []).length
  const density = (count) => (count === 0 ? 'none' : count < 10 ? 'low' : count < 30 ? 'medium' : 'high')
  signals.push(`Radius density: ${density(radiusHits)}`)
  signals.push(`Shadow density: ${density(shadowHits)}`)

  return { signals, landmarks }
}

function detectAssets($, baseUrl) {
  const scripts = $('script[src]').length
  const stylesheets = $('link[rel="stylesheet"]').length
  const domains = new Set()
  let originHost = ''
  try {
    originHost = new URL(baseUrl).hostname
  } catch {
    originHost = ''
  }

  const collectHost = (value) => {
    if (!value) return
    try {
      const resolved = new URL(value, baseUrl)
      if (resolved.hostname && resolved.hostname !== originHost) {
        domains.add(resolved.hostname)
      }
    } catch {
      return
    }
  }

  $('script[src]').each((i, el) => collectHost($(el).attr('src')))
  $('link[href]').each((i, el) => collectHost($(el).attr('href')))

  const favicon = $('link[rel~="icon"]').attr('href') || '/favicon.ico'
  const ogImage = $('meta[property="og:image"]').attr('content') || null

  return {
    scripts,
    stylesheets,
    externalDomains: [...domains].slice(0, 12),
    favicon,
    ogImage
  }
}

function buildReport({ $, url, finalUrl, status, html }) {
  const title = $('title').first().text().trim() || null
  const description = $('meta[name="description"]').attr('content') || null
  const themeColor = $('meta[name="theme-color"]').attr('content') || null
  const lang = $('html').attr('lang') || null
  const dir = $('html').attr('dir') || null

  const colors = detectColors($, themeColor)
  const fonts = detectFonts($)
  const motion = detectMotion($)
  const stack = detectStack($)
  const layout = detectLayout($)
  const assets = detectAssets($, finalUrl)

  return {
    ok: true,
    analyzedAt: new Date().toISOString(),
    url,
    finalUrl,
    status,
    overview: { title, description, themeColor, lang, dir },
    colors,
    fonts,
    motion,
    layout,
    stack,
    assets,
    notes: [
      'Animasi runtime murni tanpa library yang dikenal mungkin tidak terdeteksi sepenuhnya.',
      'Deteksi berbasis penanda HTML/CSS/JS statis, bukan hasil rendering penuh browser.'
    ]
  }
}

module.exports = { buildReport }
