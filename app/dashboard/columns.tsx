"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Project = {
  _id: Id<"projects">;
  name: string;
  description: string;
  link: string | null;
  source: string | null;
  stack: Id<"stacks">[];
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const project = row.original;
      return (
        <UpdateProjectDialog project={project}>
          <DeleteProjectDialog project={project}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{project.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <DialogTrigger className="w-full">Update Data</DialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AlertDialogTrigger className="w-full">
                    Delete Project
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </DeleteProjectDialog>
        </UpdateProjectDialog>
      );
    },
  },
];

function UpdateProjectDialog({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const { name, description, link, source } = project;
  const [projectState, setProjectState] = useState({
    name,
    description,
    link,
    source,
  });
  useEffect(() => {
    const { name, description, link, source } = project;
    setProjectState({
      name,
      description,
      link,
      source,
    });
  }, [project]);
  const updateProject = useMutation(api.projects.update);
  const handleUpdate = () => {
    updateProject({ ...projectState, id: project._id as Id<"projects"> });
  };

  return (
    <Dialog>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-4">Update {project.name}</DialogTitle>
          <DialogDescription className="space-y-4" asChild>
            <div>
              <div className="flex items-center justify-between gap-4">
                <p>Name:</p>
                <Input
                  type="text"
                  value={projectState.name}
                  onChange={(e) => {
                    setProjectState({ ...projectState, name: e.target.value });
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <p>Description:</p>
                <Input
                  type="text"
                  value={projectState.description}
                  onChange={(e) => {
                    setProjectState({
                      ...projectState,
                      description: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <p>Link:</p>
                <Input
                  type="text"
                  value={projectState.link ?? ""}
                  onChange={(e) => {
                    setProjectState({ ...projectState, link: e.target.value });
                  }}
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <p>Source:</p>
                <Input
                  type="text"
                  value={projectState.source ?? ""}
                  onChange={(e) => {
                    setProjectState({
                      ...projectState,
                      source: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col items-center justify-between gap-4">
                <AddStackPopover project={project} />
                <StackList
                  defaultStacks={project.stack}
                  projectId={project._id}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
  );
}

function StackList({
  defaultStacks,
  projectId,
}: {
  defaultStacks: Id<"stacks">[];
  projectId: Id<"projects">;
}) {
  const stacks = useQuery(api.stacks.getList, { ids: defaultStacks });
  const removeStack = useMutation(api.projects.removeStack);
  return (
    <div className="flex flex-wrap gap-4">
      {stacks &&
        stacks.map((stack, i) => (
          <div key={i} className="p-4 border-2 rounded-lg relative">
            <div className="absolute top-0 right-0 py-1">
              <button
                onClick={() => removeStack({ id: projectId, stack: stack._id })}
              >
                <Trash2 className="h-3 text-red-500 cursor-pointer" />
              </button>
            </div>
            {stack.name}
          </div>
        ))}
    </div>
  );
}

function AddStackPopover({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const stacks = useQuery(api.stacks.get);
  const addStack = useMutation(api.projects.addStack);
  return (
    <div className="flex items-center space-x-4 z-50">
      <p className="text-muted-foreground text-sm">Stack</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            + Add stack
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Add stack..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {stacks &&
                  stacks.map((stack) => (
                    <CommandItem
                      key={stack._id}
                      value={stack.name}
                      onSelect={() => {
                        addStack({
                          id: project._id as Id<"projects">,
                          stack: stack._id,
                        });
                        setOpen(false);
                      }}
                    >
                      {stack.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DeleteProjectDialog({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const deleteProject = useMutation(api.projects.destroy);
  const handleDelete = () => {
    deleteProject({ id: project._id as Id<"projects"> });
  };

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            project {"'" + project.name + "'"} and remove its data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
