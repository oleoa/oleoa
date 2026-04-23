/* eslint-disable @next/next/no-img-element */
"use client";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Stack } from "@/db/types";
import { createStack, updateStack, deleteStack } from "./actions";

export default function StacksManager({ initialStacks }: { initialStacks: Stack[] }) {
  return (
    <div>
      <div className="flex flex-wrap md:justify-start justify-center gap-4">
        {initialStacks.map((s) => (
          <StackCard stack={s} key={s._id} />
        ))}
        <AddStack />
      </div>
    </div>
  );
}

function AddStack() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [href, setHref] = useState("");
  const handleCreate = async () => {
    await createStack(name, href);
    setName("");
    setHref("");
    router.refresh();
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex gap-4 items-center justify-center">
                <p>Source:</p>
                <Input
                  value={href}
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
  const router = useRouter();
  const [stackState, setStackState] = useState(stack);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    setStackState(stack);
  }, [stack]);

  const handleUpdate = async () => {
    let formData: FormData | null = null;
    if (selectedImage) {
      formData = new FormData();
      formData.append("image", selectedImage);
    }
    await updateStack(stack._id, stackState.name, stackState.href, formData);
    setSelectedImage(null);
    router.refresh();
  };

  const handleDelete = async () => {
    await deleteStack(stack._id);
    router.refresh();
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="rounded-lg w-24 h-24 border-2 flex items-center justify-center hover:bg-neutral-200 transition-all duration-300 cursor-pointer">
            {stack.image ? (
              <img src={stack.image} alt={stack.name} className="p-4" />
            ) : (
              stack.name
            )}
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
                <div className="flex items-center justify-center w-full gap-4">
                  <p>Image:</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setSelectedImage(event.target.files?.[0] ?? null)
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
