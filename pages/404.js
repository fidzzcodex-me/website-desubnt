import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Halaman tidak ditemukan — Web Design Inspector</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Navbar />

      <main className="flex min-h-[70vh] items-center justify-center bg-paper px-6 py-20">
        <div className="mx-auto flex max-w-md flex-col items-center text-center" data-aos="fade-up">
          <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-brand-100 animate-radar" />
            <span className="absolute inset-2 rounded-full bg-brand-100 animate-radar [animation-delay:0.6s]" />
            <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white">
              <i className="fa-solid fa-satellite-dish text-xl" />
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink-900">Tidak ada sinyal di sini</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500">
            Halaman yang dicari tidak tersedia. Alamat mungkin salah ketik, sudah dipindah, atau memang tidak pernah ada.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Kembali ke beranda
            </Link>
            <Link
              href="/analyzer"
              className="rounded-full border border-ink-100 px-6 py-2.5 text-sm font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700"
            >
              Buka analyzer
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
