import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Itinerary } from "@/types"

export const columns: ColumnDef<Itinerary & {
  itineraryDays?: Array<{
    itineraryDestinations?: Array<{
      destination?: { city?: string }
    }>
  }>
}>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "cities",
      header: "Cities",
      cell: ({ row }) => {
        const itinerary = row.original
        const citiesSet = new Set<string>()
        if (itinerary.itineraryDays && Array.isArray(itinerary.itineraryDays)) {
          itinerary.itineraryDays.forEach(day => {
            if (day.itineraryDestinations && Array.isArray(day.itineraryDestinations)) {
              day.itineraryDestinations.forEach(item => {
                if (item.destination?.city) citiesSet.add(item.destination.city)
              })
            }
          })
        }
        return Array.from(citiesSet).join(', ')
      },
    },
    {
      accessorKey: "days",
      header: "Days",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const itinerary = row.original
        return new Date(itinerary.createdAt || '').toLocaleDateString()
      }
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const itinerary = row.original
        return (
          <div className="space-x-2">
            <Button variant="outlinePrimary" size="sm" onClick={() => window.location.href = `/itineraries/show?itineraryId=${itinerary.id}`}>View</Button>
          </div>
        )
      }
    }
  ]
