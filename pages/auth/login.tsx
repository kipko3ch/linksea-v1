import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/auth?tab=login')
  }, [router])

  return null
} 