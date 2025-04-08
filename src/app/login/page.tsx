import { Suspense } from 'react'
import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div>Loading form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
