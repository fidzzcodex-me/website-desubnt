import { useEffect } from 'react'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import Head from 'next/head'
import AOS from 'aos'
import 'aos/dist/aos.css'
import '../styles/globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono'
})

export default function App({ Component, pageProps }) {
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: 'ease-out-quart',
      once: true,
      offset: 40
    })
  }, [])

  return (
    <div className={`${jakarta.variable} ${mono.variable} font-sans`}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </div>
  )
}
