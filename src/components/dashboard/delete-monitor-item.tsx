"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { deleteMonitor } from "~/app/actions/monitor";

interface DeleteMonitorItemProps {
  id: string;
  name: string;
}

export function DeleteMonitorItem({ id, name }: DeleteMonitorItemProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMonitor(id);
      setOpen(false);
    } catch (error) {
      console.error("Failed to delete monitor", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <DropdownMenuItem
        className="text-rose-500 focus:text-rose-500 focus:bg-rose-500/10 cursor-pointer font-medium w-full"
        onSelect={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" /> Delete
      </DropdownMenuItem>
      
      <AlertDialogContent className="bg-[#0f172a] border-slate-700 text-slate-300">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            This will permanently delete the monitor <span className="text-indigo-400 font-mono">{name}</span> and remove all associated ping history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-slate-700 hover:bg-white/5 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-rose-500 hover:bg-rose-600 text-white border-0"
          >
            {isDeleting ? "Deleting..." : "Delete Monitor"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}