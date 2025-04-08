'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/DataTable'
import { columns } from './tables/destination-columns'
import { Destination } from '@/types'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function ItineraryTablePage() {
  const [data, setData] = useState<Destination[]>([])

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        console.error('Failed to fetch destinations:', err)
        setData([])
      })
  }, [])

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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">All Destinations</h1>

            <Button asChild>
              <Link href="/dashboard/destinations/create">
                Add Destination
              </Link>
            </Button>
          </div>
          <DataTable columns={columns} data={data} />
        </motion.div>
      </div>
    </main>
  )
}
