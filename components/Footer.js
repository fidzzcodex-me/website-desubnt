export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-ink-500 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <i className="fa-solid fa-magnifying-glass-chart text-xs" />
          </span>
          <span className="font-medium text-ink-700">Web Design Inspector</span>
        </div>
        <p>Alat pembaca struktur desain. Menyajikan sinyal faktual, bukan penilaian estetika.</p>
      </div>
    </footer>
  )
}
