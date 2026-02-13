"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // for visibility
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Campaign } from "@/routes/api/campaigns";
import { TableColumnHeader } from "../table/TableColumnHeader";

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
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "adCount",
    header: ({ column }) => (
      <TableColumnHeader
        column={column}
        title="Ad Count"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("adCount")}</div>;
    },
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
      const [startDate, endDate] = row.getValue("flightDate") as [
        string,
        string,
      ];

      return `${startDate} - ${endDate}`;
    },
  },
  {
    accessorKey: "impressions",
    header: ({ column }) => (
      <TableColumnHeader
        column={column}
        title="Impressions"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("adCount")}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    enableSorting: false,
    // header: () => <div className="text-right">Manage</div>,
    cell: ({ row }) => {
      // You can access the row data using row.original in the cell function. Use this to
      // handle actions for your row eg. use the id to make a DELETE call to your API.
      const campaign = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(campaign.id.toString());
                  toast("ID has successfully been copied to your clipboard");
                } catch (e) {
                  toast("ID has failed to copy to your clipboard");
                }
              }}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>View Analytics</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
