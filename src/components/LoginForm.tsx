'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const callbackUrl = searchParams?.get('callbackUrl') || '/'

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      router.push('/dashboard')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Login failed')
        return
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Login berhasil!')
      router.push(callbackUrl)
    } catch (err) {
      console.error(err)
      toast.error('Terjadi kesalahan saat login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-xl shadow space-y-5"
    >
      <h2 className="text-2xl font-bold text-center">Login</h2>

      <Input
        type="email"
        placeholder="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        name="password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
