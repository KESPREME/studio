// src/app/admin/_components/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Report, Status } from "@/lib/types"
import { TimeAgo } from "@/components/time-ago"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

async function updateReportStatus(reportId: string, status: Status) {
  const response = await fetch(`/api/reports/${reportId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update status');
  }
}


export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="truncate max-w-xs">{row.original.description}</div>,
  },
  {
    accessorKey: "urgency",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Urgency
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const urgency = row.original.urgency
      const variant = urgency === 'High' ? 'destructive' : urgency === 'Moderate' ? 'secondary' : 'default'
      return <Badge variant={variant}>{urgency}</Badge>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
     cell: ({ row }) => {
      const status = row.original.status
      const getStatusColor = (status: Report['status']) => {
        switch (status) {
          case 'New': return 'bg-primary';
          case 'In Progress': return 'bg-accent';
          case 'Resolved': return 'bg-green-500';
        }
      };
      return <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${getStatusColor(status)}`}></span>
        <span>{status}</span>
      </div>
    },
  },
   {
    accessorKey: "createdAt",
    header: "Reported",
    cell: ({ row }) => <TimeAgo dateString={row.original.createdAt} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original
      const [currentStatus, setCurrentStatus] = useState<Status>(report.status);
      const { toast } = useToast();

      const handleStatusChange = async (newStatus: Status) => {
        try {
          await updateReportStatus(report.id, newStatus);
          setCurrentStatus(newStatus);
          // This is a bit of a hack to force a table refresh. In a real app, you'd use a state management library.
          window.location.reload();
          toast({ title: "Status Updated", description: `Report status changed to ${newStatus}.` });
        } catch (error) {
          toast({ title: "Update Failed", variant: "destructive", description: "Could not update report status." });
        }
      };

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
              onClick={() => navigator.clipboard.writeText(report.id)}
            >
              Copy report ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Update Status</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                 <DropdownMenuRadioGroup value={currentStatus} onValueChange={(value) => handleStatusChange(value as Status)}>
                    <DropdownMenuRadioItem value="New">New</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="In Progress">In Progress</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Resolved">Resolved</DropdownMenuRadioItem>
                 </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
