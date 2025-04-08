'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ToggleTheme } from '@/components/ToggleTheme'

const Header = () => {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (err: any) {
        console.error('Failed to parse user from localStorage', err)
        localStorage.removeItem('user')
        setUser(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    document.cookie = 'token=; Max-Age=0; path=/'
    router.refresh()
  }

  return (
    <header className="w-full px-4 py-3 border-b bg-background shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-primary cursor-pointer">
          JapanTrip
        </Link>

        <div className="flex items-center gap-3">
          <ToggleTheme />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outlinePrimary">
                  Hi, {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/itineraries" className="cursor-pointer w-full">My Itineraries</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer w-full">Profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {/* Extra options for desktop only */}
                <DropdownMenuGroup className="flex flex-col sm:hidden">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/destinations/manage" className="cursor-pointer w-full">List Destinations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/destinations/create" className="cursor-pointer w-full">Add Destination</Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer w-full text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
