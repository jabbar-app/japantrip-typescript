import { Suspense } from 'react'
import ProfileEdit from '@/components/ProfileEdit'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <ProfileEdit />
    </Suspense>
  )
}
