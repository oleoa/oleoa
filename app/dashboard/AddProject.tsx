"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AddProject() {
  const [projectState, setProjectState] = useState({
    name: "",
    description: "",
    link: "",
    source: "",
  });
  const addProject = useMutation(api.projects.add);
  const handleAdd = () => {
    addProject(projectState);
  };
  return (
    <div className="py-2 w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-4">Add a new project</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <p>Name:</p>
                  <Input
                    type="text"
                    value={projectState.name}
                    onChange={(e) => {
                      setProjectState({
                        ...projectState,
                        name: e.target.value,
                      });
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
                      setProjectState({
                        ...projectState,
                        link: e.target.value,
                      });
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
                    <Button onClick={handleAdd}>Create</Button>
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
