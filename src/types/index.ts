export type Destination = {
  id: string
  name: string
  city: string
  description?: string
  imageUrl?: string
  visitDurationHours?: number
  rating: number
  category: string
  recommendedTime?: string
  priority: number
  isIndoor?: boolean
  hasTicket?: boolean
  ticketPriceYen?: number
  openHour?: string
  closeHour?: string
  link_gmaps?: string
  suitableForKids?: boolean
  estimatedWalkMinutesFromPrevious?: number
  createdAt?: string
  updatedAt?: string
}

export type Itinerary = {
  id: string
  title: string
  days: number
  userId: string
  createdAt?: string
  updatedAt?: string
}

export type User = {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}
