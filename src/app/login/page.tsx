'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'


export default function LoginPage() {
  // Initialize router before useEffect hook
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize form state and loading state
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  // Ambil callbackUrl dari query, atau fallback ke "/"
  const callbackUrl = searchParams?.get('callbackUrl') || '/'

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      router.push('/dashboard') // If user is logged in, redirect to dashboard
    }
  }, [router]) // Make sure to include 'router' in the dependency array

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Call the API to perform login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      // If the response is not ok, show error message
      if (!res.ok) {
        toast.error(data.error || 'Login failed')
        return
      }

      // Save the user data to localStorage upon successful login
      localStorage.setItem('user', JSON.stringify(data.user))

      // Show success message and redirect to the callbackUrl or '/' if not available
      toast.success('Login berhasil!')
      router.push(callbackUrl)
    } catch (err) {
      console.log(err)
      toast.error('Terjadi kesalahan saat login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-xl shadow space-y-5">
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {/* Email input */}
        <Input
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Password input */}
        <Input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}
