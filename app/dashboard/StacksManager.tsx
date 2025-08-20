"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Stack } from "./interfaces";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function StacksManager() {
  const stacks = useQuery(api.stacks.get);
  return (
    <div>
      <div className="flex flex-wrap md:justify-start justify-center gap-4">
        {stacks
          ? stacks.map((s, i) => <StackCard stack={s} key={i} />)
          : Array.from({ length: 24 }).map((_, i: number) => (
              <Skeleton key={i} className="h-24 w-24 rounded-lg" />
            ))}
        {stacks != undefined && <AddStack />}
      </div>
    </div>
  );
}

function AddStack() {
  const [name, setName] = useState("");
  const [href, setHref] = useState("");
  const createStack = useMutation(api.stacks.create);
  const handleCreate = () => {
    createStack({ name, href });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="rounded-lg w-24 h-24 border-2 flex items-center justify-center hover:bg-neutral-200 transition-all duration-300 cursor-pointer">
          <Plus />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Create new Stack</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center justify-center">
                <p>Name:</p>
                <Input
                  defaultValue={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex gap-4 items-center justify-center">
                <p>Source:</p>
                <Input
                  defaultValue={href}
                  onChange={(e) => setHref(e.target.value)}
                />
              </div>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>Create</Button>
              </DialogTrigger>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function StackCard({ stack }: { stack: Stack }) {
  const [stackState, setStackState] = useState(stack);
  useEffect(() => {
    setStackState(stack);
  }, [stack]);

  const updateStack = useMutation(api.stacks.update);
  const handleUpdate = () => {
    const { _id, name, href } = stackState;
    updateStack({ id: _id as Id<"stacks">, name, href });
  };

  const deleteStack = useMutation(api.stacks.destroy);
  const handleDelete = () => {
    deleteStack({ id: stack._id as Id<"stacks"> });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="rounded-lg w-24 h-24 border-2 flex items-center justify-center hover:bg-neutral-200 transition-all duration-300 cursor-pointer">
            {stack.name}
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-4">Edit {stack.name}</DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center w-full gap-4">
                  <p>Name:</p>
                  <Input
                    value={stackState.name}
                    onChange={(e) =>
                      setStackState({ ...stackState, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center justify-center w-full gap-4">
                  <p>Source:</p>
                  <Input
                    value={stackState.href}
                    onChange={(e) =>
                      setStackState({ ...stackState, href: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this stack and remove its data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <DialogTrigger asChild>
                          <AlertDialogAction onClick={handleDelete}>
                            Continue
                          </AlertDialogAction>
                        </DialogTrigger>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <DialogTrigger asChild>
                    <Button onClick={handleUpdate}>Update</Button>
                  </DialogTrigger>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
