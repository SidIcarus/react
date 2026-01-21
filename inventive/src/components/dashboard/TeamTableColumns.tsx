"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Check } from 'lucide-react'
import { TableColumnHeader } from '../table/TableColumnHeader'
import type { TeamMember } from '@/routes/api.teamMembers'

export const TeamTableColumns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Member" />
    ),
  },
  {
    accessorKey: "lastLoginDate",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Last Login" />
    ),
  },
  {
    accessorKey: "isAdmin",
    header: () => <div className="text-center">Admin</div>,
    cell: ({ row }) => {
      return row.getValue("isAdmin")
        ? <div className="flex justify-center">{ row.original["isGlobalAdmin"] ? 'Global Admin' : <Check className="h-4 w-4" />}</div>
        : ''
    }
  },
  {
    accessorKey: "isBuilder",
    header: () => <div className="text-center">Builder</div>,
    cell: ({ row }) => row.getValue("isBuilder")
      ? <div className="flex justify-center"><Check className="h-4 w-4" /></div>
      : '',
  },
  {
    accessorKey: "isAnalyst",
    header: () => <div className="text-center">Analyst</div>,
    cell: ({ row }) => row.getValue("isAnalyst")
      ? <div className="flex justify-center"><Check className="h-4 w-4" /></div>
      : '',
  },
  {
    accessorKey: "isTrafficker",
    header: () => <div className="text-center">Trafficking</div>,
    cell: ({ row }) => row.getValue("isTrafficker")
      ? <div className="flex justify-center"><Check className="h-4 w-4" /></div>
      : '',
  },
]
