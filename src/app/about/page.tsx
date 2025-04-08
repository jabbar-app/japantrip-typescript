'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold mb-4 text-primary">About Japan Smart Trip Planner</h1>

          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            <strong>Japan Smart Trip Planner</strong> is an open source travel planning app built with developers and first-time travelers in mind. It allows you to create a smart, personalized itinerary for Japan — complete with day-by-day timelines, categorized destinations, and a smooth planning experience.
          </p>

          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            What started as a personal project to solve my own travel pain point has now become a fullstack playground powered entirely by TypeScript. From a drag-and-drop itinerary builder to a RESTful API backend, every component is designed for both usability and scalability.
          </p>

          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            The project embraces modern best practices: edge-ready API routes, type-safe ORM with Prisma, structured file-based routing with Next.js App Router, reusable components, and state management ready to scale.
          </p>

          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            Whether you`re a solo traveler looking to organize your Tokyo trip, a developer curious about clean architecture with TypeScript, or a company looking for tech talent passionate about real-world solutions — this project is built for you.
          </p>

          <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
            Contributions, feedback, and collaborations are always welcome. The journey doesn’t end here — this is just the beginning 🚀
          </p>

          <div className="mt-8 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JapanTrip. Built with 💙 by <a href="https://www.linkedin.com/in/jabbarpanggabean/" className='text-blue-500'>Jabbar Ali Panggabean</a>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
