import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5 text-ink-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <i className="fa-solid fa-magnifying-glass-chart text-sm" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Web Design Inspector</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-ink-700 md:flex">
          <a href="/#fitur" className="hover:text-ink-900">Fitur</a>
          <a href="/#cara-kerja" className="hover:text-ink-900">Cara kerja</a>
          <a href="/#bukan-ini" className="hover:text-ink-900">Batasan</a>
        </nav>
        <Link
          href="/analyzer"
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700"
        >
          Mulai analisis
        </Link>
      </div>
    </header>
  )
}
