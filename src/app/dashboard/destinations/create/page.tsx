'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

const cities = [
  'Tokyo', 'Kyoto', 'Osaka', 'Nara', 'Sapporo', 'Fukuoka', 'Hiroshima', 'Nagoya', 'Kobe', 'Yokohama'
]

export default function CreateDestinationPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    city: '',
    description: '',
    imageUrl: '',
    visitDurationHours: '',
    rating: '',
    category: '',
    recommendedTime: '',
    priority: '',
    isIndoor: false,
    hasTicket: false,
    ticketPriceYen: '',
    openHour: '',
    closeHour: '',
    link_gmaps: '',
    suitableForKids: false,
    estimatedWalkMinutesFromPrevious: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (name: string) => {
    setForm(prev => ({ ...prev, [name]: !prev[name as keyof typeof form] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          visitDurationHours: parseFloat(form.visitDurationHours),
          rating: parseFloat(form.rating),
          priority: parseInt(form.priority),
          ticketPriceYen: parseInt(form.ticketPriceYen),
          estimatedWalkMinutesFromPrevious: parseInt(form.estimatedWalkMinutesFromPrevious)
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create destination')
      toast.success('Destination created!')
      router.push('/dashboard/destinations/manage')
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
          className="max-w-5xl mx-auto p-6"
        >
          <h1 className="text-2xl font-bold mb-6">Add New Destination</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="name" className="block font-medium text-sm">Name</label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
              <label htmlFor="city" className="block font-medium text-sm">City</label>
              <select id="city" name="city" value={form.city} onChange={handleChange} required className="w-full border px-3 py-2 rounded-md">
                <option value="">Select City</option>
                {cities.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="description" className="block font-medium text-sm">Description</label>
              <Textarea id="description" name="description" value={form.description} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
              <label htmlFor="imageUrl" className="block font-medium text-sm">Image URL</label>
              <Input id="imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label htmlFor="category" className="block font-medium text-sm">Category</label>
              <Input id="category" name="category" value={form.category} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
              <label htmlFor="recommendedTime" className="block font-medium text-sm">Recommended Time</label>
              <Input id="recommendedTime" name="recommendedTime" value={form.recommendedTime} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label htmlFor="rating" className="block font-medium text-sm">Rating</label>
              <Input id="rating" name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
              <label htmlFor="visitDurationHours" className="block font-medium text-sm">Visit Duration (hours)</label>
              <Input id="visitDurationHours" name="visitDurationHours" type="number" step="0.5" value={form.visitDurationHours} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label htmlFor="priority" className="block font-medium text-sm">Priority</label>
              <Input id="priority" name="priority" type="number" value={form.priority} onChange={handleChange} required />
            </div>

            <div className="space-y-1">
              <label htmlFor="ticketPriceYen" className="block font-medium text-sm">Ticket Price (Yen)</label>
              <Input id="ticketPriceYen" name="ticketPriceYen" type="number" value={form.ticketPriceYen} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label htmlFor="openHour" className="block font-medium text-sm">Open Hour</label>
              <Input id="openHour" name="openHour" type="time" value={form.openHour} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label htmlFor="closeHour" className="block font-medium text-sm">Close Hour</label>
              <Input id="closeHour" name="closeHour" type="time" value={form.closeHour} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label htmlFor="link_gmaps" className="block font-medium text-sm">Google Maps Link</label>
              <Input id="link_gmaps" name="link_gmaps" value={form.link_gmaps} onChange={handleChange} />
            </div>

            <div className="space-y-1">
              <label htmlFor="estimatedWalkMinutesFromPrevious" className="block font-medium text-sm">Estimated Walk (minutes)</label>
              <Input id="estimatedWalkMinutesFromPrevious" name="estimatedWalkMinutesFromPrevious" type="number" value={form.estimatedWalkMinutesFromPrevious} onChange={handleChange} />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="isIndoor" checked={form.isIndoor} onCheckedChange={() => handleCheckbox('isIndoor')} className="border border-gray-300 dark:border-gray-600" />
                <label htmlFor="isIndoor" className="text-sm">Indoor</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="hasTicket" checked={form.hasTicket} onCheckedChange={() => handleCheckbox('hasTicket')} className="border border-gray-300 dark:border-gray-600" />
                <label htmlFor="hasTicket" className="text-sm">Ticket Required</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="suitableForKids" checked={form.suitableForKids} onCheckedChange={() => handleCheckbox('suitableForKids')} className="border border-gray-300 dark:border-gray-600" />
                <label htmlFor="suitableForKids" className="text-sm">Suitable for Kids</label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Destination'}
            </Button>
          </form>
        </motion.div>
      </div>
    </main>
  )
}