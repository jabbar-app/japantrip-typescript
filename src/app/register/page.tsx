import { Suspense } from 'react'
import RegisterForm from '@/components/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors">
      <Suspense fallback={<div>Loading registration form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
