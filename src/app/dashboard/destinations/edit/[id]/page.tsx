import { Suspense } from 'react'
import DestinationEdit from '@/components/DestinationEdit'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading destinations...</div>}>
      <DestinationEdit />
    </Suspense>
  )
}
