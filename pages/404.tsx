import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    // Get the path from the URL
    const path = window.location.pathname.substring(1) // Remove leading slash
    if (path) {
      // If there's a path, treat it as a username
      router.push(`/[username]`, `/${path}`, { shallow: true })
    }
  }, [router])

  return null
} 