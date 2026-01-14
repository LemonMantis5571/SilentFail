"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteAccount } from "~/app/actions/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "sonner";

export function DeleteAccountButton({ monitorCount }: { monitorCount: number }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      toast.success("Account deleted");
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to delete account");
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white cursor-pointer">
          <Trash2 className="mr-2 h-4 w-4" /> Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-[#0B1121] border-slate-800 text-slate-300">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Are you sure?
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            This action cannot be undone. This will permanently delete your account and remove <strong className="text-white">{monitorCount} monitors</strong> along with all historical data.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex gap-4 ">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button

            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white hover:cursor-pointer"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Deletion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}