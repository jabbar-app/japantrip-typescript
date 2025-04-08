'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { motion } from 'framer-motion'

export default function EditProfilePage() {
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setProfileForm({ name: parsed.name || '', email: parsed.email || '' })
      } catch (err: any) {
        console.error('Failed to parse user from localStorage: ' + err.message)
      }
    }
  }, [])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const storedUser = localStorage.getItem('user')
    const userId = storedUser ? JSON.parse(storedUser).id : null

    if (!userId) {
      toast.error('User not logged in')
      return
    }

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profileForm, id: userId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update profile')

      // Simpan juga perubahan ke localStorage
      localStorage.setItem('user', JSON.stringify({ ...profileForm, id: userId }))

      toast.success('Profile updated!')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
      window.location.reload()
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { currentPassword, newPassword, confirmPassword } = passwordForm

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields')
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      setLoading(false)
      return
    }

    const storedUser = localStorage.getItem('user')
    const userId = storedUser ? JSON.parse(storedUser).id : null

    if (!userId) {
      toast.error('User not logged in')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, userId })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update password')

      toast.success('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex bg-gradient-to-br from-white to-sky-50 dark:from-zinc-900 dark:to-zinc-800">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto p-6"
        >
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

          <form onSubmit={handleProfileSubmit} className="space-y-4 mb-10">
            <div className="space-y-1">
              <label htmlFor="name" className="block font-medium text-sm">Name</label>
              <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} required />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block font-medium text-sm">Email</label>
              <Input id="email" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} required />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
          </form>

          <h2 className="font-semibold text-lg mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="currentPassword" className="block font-medium text-sm">Current Password</label>
              <Input id="currentPassword" name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
            </div>

            <div className="space-y-1">
              <label htmlFor="newPassword" className="block font-medium text-sm">New Password</label>
              <Input id="newPassword" name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} />
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block font-medium text-sm">Confirm New Password</label>
              <Input id="confirmPassword" name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Change Password'}
            </Button>
          </form>
        </motion.div>
      </div>
    </main>
  )
}