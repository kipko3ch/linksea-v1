import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function RegisterPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/auth?tab=signup')
  }, [router])

  return null
} 