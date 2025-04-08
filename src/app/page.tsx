"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/Navbar'

type Destination = {
  id: string
  name: string
  city: string
  description: string
  imageUrl: string
  visitDurationHours: number
  rating: number
  category: string
  recommendedTime: string
  priority: number
  isIndoor: boolean
  hasTicket: boolean
  ticketPriceYen: number
  openHour: string
  closeHour: string
  link_gmaps: string
  suitableForKids: boolean
  estimatedWalkMinutesFromPrevious: number
}

export default function HomePage() {
  const [destinations, setDestinations] = useState<Destination[]>([])

  useEffect(() => {
    fetch('/api/destinations')
      .then((res) => res.json())
      .then((data) => setDestinations(data))
  }, [])

  return (
    <>
      <Navbar />

      <main className="min-h-screen text-foreground">
        {/* Hero Section */}
        <section id="hero">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
            <div className="inline-flex items-center py-1 px-1 pr-4 mb-7 text-sm text-muted-foreground bg-muted rounded-full hover:bg-muted/80">
              <span className="text-xs bg-primary text-white px-4 py-1.5 rounded-full mr-3">
                New
              </span>
              <span className="text-sm font-medium">JapanTrip is live! See what`s new</span>
            </div>
            <h1 className="mb-4 text-4xl font-extrabold">Japan Travel Itinerary Planner</h1>
            <p className="mb-8 text-lg text-muted-foreground lg:text-xl sm:px-16 xl:px-48">
              At SmartTrip, we focus on unlocking Japan`s hidden gems and ensuring your travel dreams come true.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Button asChild variant="outline" size="lg">
                <Link href="#">Watch Tutorial</Link>
              </Button>

              <Button asChild size="lg">
                <Link href="/destinations">Start create itinerary</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-6">
            {destinations
              .sort((a, b) => a.priority - b.priority) // Sort destinations by priority
              .slice(0, 4) // Slice the first 4 items
              .map((dest) => (
                <Link key={dest.id} href={`/destinations/`}> {/* Dynamic route for each destination */}
                  <div className="bg-background border rounded-lg shadow hover:shadow-lg transition">
                    <img
                      className="rounded-t-lg w-full h-48 object-cover"
                      src={dest.imageUrl || 'https://via.placeholder.com/400x300'} // Default image URL
                      alt={dest.name}
                    />
                    <div className="p-5">
                      <h5 className="text-xl font-bold">{dest.name}</h5>
                      <p className="mt-2 text-sm text-muted-foreground">{dest.city}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>

          {destinations.length === 0 && (
            <div className="text-center text-muted-foreground mt-6">
              No destinations found. Please check back later!
            </div>
          )}

          <div className="text-center mt-12">
            <Button asChild variant="outlinePrimary" size="lg">
              <Link href="/destinations">Explore destinations</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                Useful Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2">
                Plan Your Dream Trip to Japan with Ease
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                JapanTrip is your personal assistant to build perfect itineraries, explore top destinations, and travel smarter.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, idx) => (
                <FeatureBox key={idx} title={feature.title} desc={feature.desc} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-50 dark:bg-blue-950">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start planning today</h2>
            <p className="text-muted-foreground mb-8">
              Select all your destinations and let us create the itinerary for you!
            </p>
            <Link href="/destinations">
              <Button size="lg">Explore now</Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

const features = [
  { title: 'Smart Itinerary Generator', desc: 'Auto-generate optimized travel plans based on your time, interests, and preferences.' },
  { title: 'Destination Explorer', desc: 'Browse curated destinations by city, category, rating, or indoor/outdoor activities.' },
  { title: 'Personalized Schedule', desc: 'Adjust visit duration, opening hours, and travel time to fit your travel style.' },
  { title: 'Multi-City Planning', desc: 'Effortlessly plan routes across Tokyo, Kyoto, Osaka, and more in one unified timeline.' },
  { title: 'Offline Access', desc: 'Download your itinerary and maps for offline access during your trip.' },
  { title: 'Itinerary Sharing', desc: 'Share your travel plans with friends or export as printable documents.' }
]

function FeatureBox({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="text-center p-6 border rounded-xl hover:shadow-lg transition">
      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full text-2xl font-bold">
        ✓
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  )
}