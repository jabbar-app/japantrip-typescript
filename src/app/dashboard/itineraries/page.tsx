import { Suspense } from 'react'
import ItinerariesView from '@/components/ItinerariesView'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading itinerary...</div>}>
      <ItinerariesView />
    </Suspense>
  )
}
