import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Destination } from "@/types"

export const columns: ColumnDef<Destination>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="cursor-pointer"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "rating",
    header: "Rating",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const destination = row.original

      return (
        <div className="flex gap-2">
          <Button
            variant="outlinePrimary"
            size="sm"
            className="cursor-pointer"
            onClick={() =>
              window.location.href = `/dashboard/destinations/view/${destination.id}`
            }
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="outlinePrimary"
            size="sm"
            className="cursor-pointer"
            onClick={() =>
              window.location.href = `/dashboard/destinations/edit/${destination.id}`
            }
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            variant="outlineDanger"
            size="sm"
            className="cursor-pointer"
            onClick={async () => {
              const confirmDelete = confirm(`Delete ${destination.name}?`)
              if (confirmDelete) {
                try {
                  const res = await fetch(`/api/destinations/${destination.id}`, {
                    method: 'DELETE',
                  })

                  if (!res.ok) {
                    throw new Error('Failed to delete destination')
                  }

                  alert('Destination deleted successfully')
                  window.location.reload()
                } catch (error) {
                  console.error(error)
                  alert('Failed to delete destination')
                }
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
