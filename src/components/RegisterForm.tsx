'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ToggleTheme } from '@/components/ToggleTheme'
import { motion } from 'framer-motion'
import { FcGoogle } from 'react-icons/fc'

export default function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Registration failed')
        return
      }

      toast.success('Account created successfully!')
      router.push('/')
    } catch (err) {
      console.log(err)
      toast.error('Unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="w-full max-w-md border rounded-2xl bg-card p-8 shadow-xl space-y-6 relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute top-4 right-4">
        <ToggleTheme />
      </div>

      <h1 className="text-2xl font-bold text-center">Create Account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>

      <Separator className="my-4" />

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => toast('Google Register not implemented yet')}
      >
        <FcGoogle size={20} />
        Register with Google
      </Button>
    </motion.div>
  )
}
