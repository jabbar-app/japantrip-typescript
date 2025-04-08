'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  AppWindowMac,
  Home,
  ListFilter,
  MapPin,
  Plus,
  Table,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()

  // Secara default aktif jika berada di halaman /dashboard/destinations/*
  const [openDestinations, setOpenDestinations] = useState(false)

  useEffect(() => {
    if (pathname?.startsWith('/dashboard/destinations')) {
      setOpenDestinations(true)
    }
  }, [pathname])

  const menu = [
    { label: 'Dashboard', href: '/dashboard', icon: <Home size={18} /> },
    { label: 'Itineraries', href: '/dashboard/itineraries', icon: <ListFilter size={18} /> },
    {
      label: 'Destinations',
      sub: [
        { label: 'Manage', href: '/dashboard/destinations/manage', icon: <Table size={16} /> },
        { label: 'Add New', href: '/dashboard/destinations/create', icon: <Plus size={16} /> }
      ],
      icon: <MapPin size={18} />
    },
    { label: 'About', href: '/about', icon: <AppWindowMac size={18} /> },
  ]

  return (
    <aside className="hidden md:block w-64 min-h-screen border-r bg-background px-4 py-6">
      <h2 className="text-xl font-bold text-primary mb-6">Dashboard</h2>
      <nav className="space-y-2">
        {menu.map((item, i) => (
          <div key={i}>
            {!item.sub ? (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent',
                  pathname === item.href ? 'bg-accent font-semibold' : ''
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ) : (
              <div className="space-y-1">
                <button
                  onClick={() => setOpenDestinations(prev => !prev)}
                  className={cn(
                    'flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-accent rounded-md transition',
                    pathname?.startsWith('/dashboard/destinations') ? 'bg-accent font-semibold text-primary' : 'text-primary'
                  )}
                >
                  {item.icon}
                  {item.label}
                  <span className="ml-auto">
                    {openDestinations ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </span>
                </button>
                {openDestinations && (
                  <div className="ml-5 space-y-1">
                    {item.sub.map((sub, j) => (
                      <Link
                        key={j}
                        href={sub.href}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent',
                          pathname === sub.href ? 'bg-accent font-semibold' : ''
                        )}
                      >
                        {sub.icon} {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
