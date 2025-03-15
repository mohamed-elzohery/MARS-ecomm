"use client";
import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type DeleteDialogProps = {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
};

const DeleteDialog: React.FC<DeleteDialogProps> = ({ action, id }) => {
  const [pending, startTrasnition] = useTransition();
  const handleDelete = async () => {
    startTrasnition(async () => {
      const res = await action(id);
      if (!res.success) toast.error(res.message);
      else toast.success(res.message);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>

        <DialogFooter className="justify-end  ">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleDelete}
            variant="destructive"
            disabled={pending}
          >
            {pending ? "Deleting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
