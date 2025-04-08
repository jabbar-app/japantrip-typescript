"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import Navbar from '@/components/Navbar'

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([])
  const [selected, setSelected] = useState<any[]>([])
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState<any | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [filter, setFilter] = useState<string[]>([])
  const [sort, setSort] = useState<string>("name")

  const router = useRouter()

  useEffect(() => {
    fetch("/api/destinations")
      .then(res => res.json())
      .then(data => {
        const all: any[] = data
        setDestinations(all)
        setCategories([...new Set(all.map(d => d.category).filter(Boolean))])
      })
  }, [])

  const filtered = destinations
    .filter(d => filter.length === 0 || filter.includes(d.category))
    .sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name)
      if (sort === "rating") return b.rating - a.rating
      if (sort === "priority") return a.priority - b.priority
      return 0
    })

  const groupedByCity = filtered.reduce((acc: Record<string, any[]>, curr) => {
    acc[curr.city] = acc[curr.city] || []
    acc[curr.city].push(curr)
    return acc
  }, {})

  const handleAdd = (dest: any) => {
    if (!selected.some(s => s.id === dest.id)) {
      setSelected(prev => [...prev, dest])
    }
  }

  const handleRemove = (id: string) => {
    setSelected(prev => prev.filter(s => s.id !== id))
  }

  const generate = () => {
    if (selected.length === 0) return alert("Select at least one destination")
    localStorage.setItem("selectedDestinations", JSON.stringify(selected))
    router.push("/dashboard/itineraries/draft")
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-6">
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <ToggleGroup type="single" value={sort} onValueChange={val => setSort(val || "name")}>
            <ToggleGroupItem value="name">Name</ToggleGroupItem>
            <ToggleGroupItem value="rating">Rating</ToggleGroupItem>
            <ToggleGroupItem value="priority">Priority</ToggleGroupItem>
          </ToggleGroup>

          <ScrollArea className="w-full sm:w-auto">
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <Badge
                  key={cat}
                  variant={filter.includes(cat) ? "default" : "secondary"}
                  onClick={() =>
                    setFilter(prev =>
                      prev.includes(cat) ? prev.filter(f => f !== cat) : [...prev, cat]
                    )
                  }
                  className="cursor-pointer"
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-10">
          {Object.entries(groupedByCity).map(([city, cityDests]) => (
            <div key={city}>
              <h2 className="text-2xl font-bold mb-4">{city}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {cityDests.map(dest => (
                  <Card key={dest.id} className="hover:shadow-lg transition">
                    <CardHeader>
                      <img
                        src={dest.imageUrl || "/placeholder.png"}
                        alt={dest.name}
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <CardTitle className="mt-2 text-lg">{dest.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      {dest.city} - {dest.category}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedDestination(dest)}
                      >
                        Details
                      </Button>
                      {selected.some(s => s.id === dest.id) ? (
                        <Button disabled className="flex-1">Added</Button>
                      ) : (
                        <Button
                          className="flex-1 cursor-pointer"
                          onClick={() => handleAdd(dest)}
                        >
                          Add
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => setOpenDrawer(true)}
          className="fixed bottom-6 right-6 rounded-full px-6 py-3 shadow-lg"
        >
          {selected.length > 0 ? `Selected (${selected.length})` : "View List"}
        </Button>

        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerContent className="p-0">
            <div className="max-h-[80vh] overflow-y-auto p-6 pb-28 space-y-4">
              <h2 className="text-xl font-bold">Selected Destinations</h2>
              {selected.length === 0 ? (
                <p className="text-muted-foreground">No destinations added.</p>
              ) : (
                <div className="space-y-4">
                  {selected.map(dest => (
                    <div key={dest.id} className="border-b pb-2">
                      <div className="font-semibold">{dest.name}</div>
                      <p className="text-sm text-muted-foreground">{dest.city}</p>
                      <Button variant="link" className="text-danger cursor-pointer" size="sm" onClick={() => handleRemove(dest.id)}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="fixed bottom-0 left-0 w-full p-6 bg-background border-t">
              <Button className="w-full cursor-pointer" onClick={generate}>Generate Itinerary</Button>
            </div>
          </DrawerContent>
        </Drawer>

        <Dialog open={!!selectedDestination} onOpenChange={() => setSelectedDestination(null)}>
          <DialogContent>
            <DialogTitle>{selectedDestination?.name || "Destination Detail"}</DialogTitle>
            {selectedDestination && (
              <div className="space-y-2 text-sm">
                <p><strong>City:</strong> {selectedDestination.city}</p>
                <p><strong>Description:</strong> {selectedDestination.description}</p>
                <p><strong>Rating:</strong> {selectedDestination.rating}</p>
                <p><strong>Category:</strong> {selectedDestination.category}</p>
                <p><strong>Recommended Time:</strong> {selectedDestination.recommendedTime}</p>
                <p><strong>Open:</strong> {selectedDestination.openHour} - {selectedDestination.closeHour}</p>
                <p>
                  <strong>Maps:</strong>{" "}
                  <a href={selectedDestination.link_gmaps} className="underline text-blue-600" target="_blank" rel="noopener noreferrer">Open</a>
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </>
  )
}
