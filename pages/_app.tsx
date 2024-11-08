import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@/lib/ThemeContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Router from 'next/router'

// Disable Next.js loading indicator
Router.events.on('routeChangeStart', () => {})
Router.events.on('routeChangeComplete', () => {})
Router.events.on('routeChangeError', () => {})

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  return (
    <ThemeProvider>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  )
} 