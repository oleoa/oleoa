"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

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
import { Input } from "@/components/ui/input";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Project = {
  _id: string;
  name: string;
  description: string;
  link: string | null;
  source: string | null;
  stacks: string[];
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
