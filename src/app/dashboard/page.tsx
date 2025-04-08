'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (err) {
        console.log(err)
        toast.error('Failed to parse user data')
      }
    }
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
          <h1 className="text-3xl font-bold text-center text-primary mb-8">
            Welcome to your Dashboard
          </h1>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Hello, {user?.name || 'Guest'}!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    You can start building your custom itinerary by visiting destinations page.
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/destinations">Explore Destinations</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    Coming soon: View your recent plans, history, and saved routes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}
