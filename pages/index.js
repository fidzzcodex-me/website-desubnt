import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScanInput from '../components/ScanInput'
import FeatureRow from '../components/FeatureRow'

const DETECTED_FEATURES = [
  {
    icon: 'fa-palette',
    title: 'Warna',
    description: 'Kandidat warna dari inline style, blok <style>, dan class bertema, dikelompokkan jadi palet ringkas beserta indikasi mode terang/gelap.',
    tag: 'max 8 warna'
  },
  {
    icon: 'fa-font',
    title: 'Tipografi',
    description: 'Font Google, @font-face, dan deklarasi font-family di CSS — dipetakan sumbernya: Google, self-hosted, atau sistem.'
  },
  {
    icon: 'fa-wand-magic-sparkles',
    title: 'Motion',
    description: 'Library animasi seperti AOS, GSAP, Framer Motion, Anime.js, Lottie, dan animate.css, ditambah sinyal @keyframes/transition dari CSS.'
  },
  {
    icon: 'fa-diagram-project',
    title: 'Layout',
    description: 'Landmark header/nav/main/footer, pola card berulang, meta viewport, serta kepadatan radius dan shadow di seluruh halaman.'
  },
  {
    icon: 'fa-layer-group',
    title: 'Stack tebakan',
    description: 'Jejak framework seperti Next.js, Nuxt, WordPress, Shopify, Tailwind, dan Bootstrap, lengkap dengan tingkat keyakinan deteksi.',
    tag: 'high / medium / low'
  },
  {
    icon: 'fa-boxes-stacked',
    title: 'Assets',
    description: 'Jumlah script dan stylesheet, domain CDN eksternal utama, serta favicon dan gambar Open Graph.'
  }
]

const STEPS = [
  {
    title: 'Masukkan URL',
    description: 'Tempel alamat website yang ingin dibaca strukturnya. Tidak perlu menambahkan https:// secara manual.'
  },
  {
    title: 'Fetch di server',
    description: 'Halaman diambil di sisi server untuk menghindari batasan CORS, dengan batas waktu dan ukuran respons.'
  },
  {
    title: 'Deteksi paralel',
    description: 'Setiap modul detektor membaca DOM dan CSS secara independen: warna, font, motion, layout, dan stack.'
  },
  {
    title: 'Laporan terstruktur',
    description: 'Semua sinyal digabung jadi satu laporan yang bisa disalin sebagai Markdown atau JSON.'
  }
]

export default function Home() {
  const router = useRouter()

  function handleHeroSubmit(url) {
    router.push(`/analyzer?url=${encodeURIComponent(url)}`)
  }

  return (
    <>
      <Head>
        <title>Web Design Inspector — Baca struktur desain sebuah website</title>
        <meta
          name="description"
          content="Masukkan URL dan dapatkan laporan faktual tentang warna, font, motion, layout, dan stack yang dipakai sebuah website."
        />
      </Head>

      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-paper px-6 pb-20 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl text-center" data-aos="fade-up">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-ink-900 md:text-5xl">
              Lihat sistem desain di balik satu alamat website
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-500 md:text-lg">
              Web Design Inspector membaca warna, font, motion, dan stack yang terpasang pada sebuah situs, lalu menyajikannya sebagai laporan faktual — bukan penilaian bagus atau jelek.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl" data-aos="fade-up" data-aos-delay="100">
            <ScanInput onSubmit={handleHeroSubmit} size="large" />
          </div>

          <div className="mx-auto mt-16 max-w-3xl" data-aos="fade-up" data-aos-delay="150">
            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft">
              <div className="relative flex items-center gap-2 overflow-hidden border-b border-ink-100 bg-ink-100/30 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-ink-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-ink-300" />
                <span className="data-label ml-3 truncate text-xs text-ink-500">https://contoh-website.com</span>
                <span className="absolute inset-y-0 left-0 w-24 animate-scan bg-gradient-to-r from-transparent via-brand-300/70 to-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-px bg-ink-100 sm:grid-cols-4">
                {['Warna', 'Font', 'Motion', 'Stack'].map((label) => (
                  <div key={label} className="bg-white px-4 py-5 text-center">
                    <p className="data-label text-[11px] text-ink-500">{label}</p>
                    <p className="mt-1 text-sm text-ink-300">menunggu scan…</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="fitur" className="border-t border-ink-100 bg-white px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div data-aos="fade-up">
              <h2 className="text-2xl font-bold text-ink-900 md:text-3xl">Yang dideteksi dalam satu laporan</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
                Setiap scan menghasilkan enam kelompok sinyal berikut, diambil langsung dari HTML, CSS, dan referensi script halaman.
              </p>
            </div>
            <div className="mt-8" data-aos="fade-up" data-aos-delay="100">
              {DETECTED_FEATURES.map((feature) => (
                <FeatureRow key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section id="cara-kerja" className="border-t border-ink-100 bg-brand-50/40 px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div data-aos="fade-up">
              <h2 className="text-2xl font-bold text-ink-900 md:text-3xl">Cara kerja</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-500">
                Empat tahap yang berjalan setiap kali sebuah URL dianalisis.
              </p>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2" data-aos="fade-up" data-aos-delay="100">
              {STEPS.map((step, index) => (
                <div key={step.title} className="flex gap-4 rounded-xl bg-white p-5 shadow-soft">
                  <span className="data-label flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs text-white">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-900">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="bukan-ini" className="border-t border-ink-100 bg-white px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div data-aos="fade-up">
              <h2 className="text-2xl font-bold text-ink-900 md:text-3xl">Yang bukan tujuan alat ini</h2>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2" data-aos="fade-up" data-aos-delay="100">
              {[
                'Bukan page builder — tidak ada fitur edit atau ubah desain langsung.',
                'Bukan penilai kualitas — tidak ada skor "desain ini bagus 9/10".',
                'Bukan perekam animasi penuh — animasi runtime murni via JavaScript mungkin terlewat.',
                'Bukan alat login — tidak ada akun, dan riwayat scan disimpan lokal di browser.'
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 rounded-xl border border-ink-100 p-4">
                  <i className="fa-solid fa-xmark mt-1 text-ink-300" />
                  <p className="text-sm leading-relaxed text-ink-700">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-ink-100 bg-brand-600 px-6 py-16">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 text-center" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-white md:text-3xl">Coba pada website mana pun</h2>
            <p className="max-w-xl text-sm leading-relaxed text-brand-100">
              Laporan bisa disalin sebagai Markdown atau JSON, dan riwayat scan tersimpan otomatis di perangkatmu.
            </p>
            <button
              onClick={() => router.push('/analyzer')}
              className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-brand-700 shadow-soft transition hover:bg-brand-50"
            >
              Mulai analisis
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
