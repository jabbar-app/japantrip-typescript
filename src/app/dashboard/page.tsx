import { Suspense } from 'react'
import DashboardView from '@/components/DashboardView'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <DashboardView />
    </Suspense>
  )
}
