import { Suspense } from 'react'
import DestinationsView from '@/components/DestinationsView'

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div>Loading destinations...</div>}>
      <DestinationsView />
    </Suspense>
  )
}
