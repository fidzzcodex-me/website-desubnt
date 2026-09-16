import { useState } from 'react'

export default function ScanInput({ initialValue = '', onSubmit, loading, size = 'default' }) {
  const [value, setValue] = useState(initialValue)

  function handleSubmit(event) {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSubmit(trimmed)
  }

  const padding = size === 'large' ? 'py-4 pl-6 pr-2' : 'py-3 pl-5 pr-2'

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-full border border-ink-100 bg-white p-1.5 shadow-soft"
    >
      <div className={`flex flex-1 items-center gap-3 ${padding}`}>
        <i className="fa-solid fa-link text-ink-300" />
        <input
          type="text"
          inputMode="url"
          placeholder="contoh.com atau https://contoh.com"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-300 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <i className="fa-solid fa-circle-notch animate-spin" />
            Memindai
          </>
        ) : (
          'Mulai'
        )}
      </button>
    </form>
  )
}
