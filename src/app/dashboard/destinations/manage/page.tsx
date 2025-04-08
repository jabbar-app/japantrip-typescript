import { Suspense } from 'react'
import DestinationManage from '@/components/DestinationManage'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading destinations...</div>}>
      <DestinationManage />
    </Suspense>
  )
}
