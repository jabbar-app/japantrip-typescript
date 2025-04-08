import { Suspense } from 'react'
import DestinationCreate from '@/components/DestinationCreate'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading destinations...</div>}>
      <DestinationCreate />
    </Suspense>
  )
}
