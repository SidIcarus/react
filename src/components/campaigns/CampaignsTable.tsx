"use client"

import { useState } from 'react'

import {
  ColumnDef,
  ColumnFiltersState, // for filtering
  flexRender,
  getCoreRowModel,
  getFilteredRowModel, // for filtering
  getPaginationRowModel, // for pagination
  getSortedRowModel, // for sorting
  SortingState, // for sorting
  useReactTable,
  VisibilityState, // for column visibility
} from "@tanstack/react-table"

import { Input } from '@/components/ui/input' // for filtering
import { Button } from '@/components/ui/button'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TablePagination } from '../table/TablePagination' // for pagination
import { TableViewOptions } from '../table/TableViewOptions' // for column visibility
// import { TableViewOptionsSimple } from '../table/TableViewOptionsSimple'

interface CampaignsTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function CampaignsTable<TData, TValue>({
  columns,
  data,
}: CampaignsTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]) // for sorting
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // for filtering
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({}) // for column visibility
  const [rowSelection, setRowSelection] = useState({}) // for row selection

  // todo: connect this to the select component
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<'All'|'Archived'|'Active'>('All')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // for pagination
    onSortingChange: setSorting, // for sorting
    getSortedRowModel: getSortedRowModel(), // for sorting
    onColumnFiltersChange: setColumnFilters, // for filtering
    getFilteredRowModel: getFilteredRowModel(), // for filtering
    onColumnVisibilityChange: setColumnVisibility, // for column visibility
    onRowSelectionChange: setRowSelection, // for row selection
    state: {
      columnFilters, // for filtering
      columnVisibility, // for column visibility
      sorting, // for sorting
      rowSelection, // for row selection
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        {/* for filtering */}
        <Input
          placeholder="Filter campaigns..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-4 justify-end">
          <Button
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
            variant="secondary"
            size="sm"
          >Archive</Button>
          <Select defaultValue="All">
            <SelectTrigger size="sm">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Active">Active Campaigns</SelectItem>
                <SelectItem value="Archived">Archived Campaigns</SelectItem>
                <SelectItem value="All">All Campaigns</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* for column visibility */}
          <TableViewOptions table={table} />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* for pagination */}
      <TablePagination table={table} />
    </div>
  )
}
