import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScanInput from '../components/ScanInput'
import ReportView from '../components/ReportView'
import { reportToMarkdown, reportToJson, downloadTextFile } from '../lib/report'

const HISTORY_KEY = 'wdi_history'
const HISTORY_LIMIT = 10

function loadHistory() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(entries) {
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, HISTORY_LIMIT)))
}

export default function Analyzer() {
  const router = useRouter()
  const [status, setStatus] = useState('idle')
  const [report, setReport] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [history, setHistory] = useState([])
  const [copiedType, setCopiedType] = useState('')

  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  const runAnalyze = useCallback(async (url) => {
    setStatus('loading')
    setErrorMessage('')
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await response.json()

      if (!data.ok) {
        setStatus('error')
        setErrorMessage(data.message || 'Terjadi kesalahan saat menganalisis URL.')
        return
      }

      setReport(data)
      setStatus('success')

      setHistory((prev) => {
        const next = [
          { url: data.finalUrl, analyzedAt: data.analyzedAt, report: data },
          ...prev.filter((item) => item.url !== data.finalUrl)
        ].slice(0, HISTORY_LIMIT)
        saveHistory(next)
        return next
      })
    } catch {
      setStatus('error')
      setErrorMessage('Gagal terhubung ke server analisis. Coba lagi.')
    }
  }, [])

  useEffect(() => {
    if (router.isReady && router.query.url && status === 'idle') {
      runAnalyze(String(router.query.url))
    }
  }, [router.isReady, router.query.url, status, runAnalyze])

  function handleCopy(type) {
    const text = type === 'markdown' ? reportToMarkdown(report) : reportToJson(report)
    navigator.clipboard.writeText(text)
    setCopiedType(type)
    setTimeout(() => setCopiedType(''), 1800)
  }

  function handleDownload() {
    downloadTextFile('laporan-desain.md', reportToMarkdown(report), 'text/markdown')
  }

  function openHistoryItem(item) {
    setReport(item.report)
    setStatus('success')
  }

  function deleteHistoryItem(url) {
    setHistory((prev) => {
      const next = prev.filter((item) => item.url !== url)
      saveHistory(next)
      return next
    })
  }

  function clearHistory() {
    setHistory([])
    saveHistory([])
  }

  return (
    <>
      <Head>
        <title>Analyzer — Web Design Inspector</title>
        <meta name="description" content="Masukkan URL untuk membaca struktur desain website secara langsung." />
      </Head>

      <Navbar />

      <main className="min-h-[70vh] bg-paper px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center" data-aos="fade-up">
            <h1 className="text-3xl font-bold text-ink-900">Analyzer</h1>
            <p className="mt-2 text-sm text-ink-500">
              Tempel URL website, lalu tekan mulai untuk membaca struktur desainnya.
            </p>
          </div>

          <ScanInput
            initialValue={typeof router.query.url === 'string' ? router.query.url : ''}
            onSubmit={runAnalyze}
            loading={status === 'loading'}
            size="large"
          />

          {status === 'error' && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <i className="fa-solid fa-triangle-exclamation mt-0.5" />
              <p>{errorMessage}</p>
            </div>
          )}

          {status === 'loading' && (
            <div className="mt-10 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
              <div className="relative h-1.5 overflow-hidden bg-ink-100">
                <span className="absolute inset-y-0 left-0 w-1/3 animate-scan bg-brand-500" />
              </div>
              <div className="space-y-3 px-6 py-8">
                <div className="h-3 w-1/2 animate-pulse rounded bg-ink-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-ink-100" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-ink-100" />
              </div>
            </div>
          )}

          {status === 'success' && report && (
            <div className="mt-10">
              <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => handleCopy('markdown')}
                  className="flex items-center gap-2 rounded-full border border-ink-100 px-4 py-2 text-xs font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  <i className="fa-regular fa-copy" />
                  {copiedType === 'markdown' ? 'Disalin' : 'Salin Markdown'}
                </button>
                <button
                  onClick={() => handleCopy('json')}
                  className="flex items-center gap-2 rounded-full border border-ink-100 px-4 py-2 text-xs font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  <i className="fa-regular fa-copy" />
                  {copiedType === 'json' ? 'Disalin' : 'Salin JSON'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 rounded-full border border-ink-100 px-4 py-2 text-xs font-medium text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
                >
                  <i className="fa-solid fa-download" />
                  Unduh .md
                </button>
              </div>
              <ReportView report={report} />
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-14">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink-900">Riwayat scan</h2>
                <button onClick={clearHistory} className="text-xs text-ink-500 hover:text-red-600">
                  Hapus semua
                </button>
              </div>
              <div className="divide-y divide-ink-100 rounded-xl border border-ink-100 bg-white">
                {history.map((item) => (
                  <div key={item.url} className="flex items-center justify-between gap-3 px-4 py-3">
                    <button
                      onClick={() => openHistoryItem(item)}
                      className="flex-1 truncate text-left text-sm text-ink-700 hover:text-brand-700"
                    >
                      {item.url}
                    </button>
                    <span className="text-xs text-ink-300">
                      {new Date(item.analyzedAt).toLocaleDateString('id-ID')}
                    </span>
                    <button
                      onClick={() => deleteHistoryItem(item.url)}
                      className="text-ink-300 hover:text-red-600"
                      aria-label="Hapus riwayat"
                    >
                      <i className="fa-solid fa-trash text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
