import { Suspense } from 'react'
import ItineraryDraft from '@/components/ItineraryDraft'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading itinerary...</div>}>
      <ItineraryDraft />
    </Suspense>
  )
}
