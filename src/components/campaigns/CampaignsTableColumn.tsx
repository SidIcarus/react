"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  MoreHorizontal,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox" // for visibility
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableColumnHeader } from '../table/TableColumnHeader'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Campaign = {
  adCount: number,
  flightDate: [string, string],
  id: number,
  impressions: number,
  lastUpdatedDate: string,
  name: string,
  status: 'Active' | 'Inactive' | 'Completed' | 'In Development'
}

export const CampaignsTableColumns: ColumnDef<Campaign>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableHiding: false,
    enableSorting: false,
  },
  {
    accessorKey: "name",
     header: ({ column }) => (
      <TableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "lastUpdatedDate",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Last Updated Date" />
    ),
  },
  {
    accessorKey: "flightDate",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Flight Date" />
    ),
    cell: ({ row }) => {
      const [startDate, endDate] = row.getValue("flightDate") as [string, string]

      return `${startDate} - ${endDate}`
    },
  },
  {
    accessorKey: "impressions",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Impressions" />
    ),
    // cell: ({ row }) => {
    //   const impressions = parseFloat(row.getValue("impressions"))
    //   const formatted = new Intl.NumberFormat("en-US", {
    //     style: "currency",
    //     currency: "USD",
    //   }).format(impressions)

    //   return <div className="font-medium">{formatted}</div>
    // },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <TableColumnHeader column={column} title="Status" />,
  },
  {
    id: "actions",
    // header: () => <div className="text-right">Manage</div>,
    cell: ({ row }) => {
      // You can access the row data using row.original in the cell function. Use this to
      // handle actions for your row eg. use the id to make a DELETE call to your API.
      const campaign = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(campaign.id.toString())}
            >
              Copy campaign ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>View Analytics</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
