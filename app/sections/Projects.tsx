/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Github from "@/public/stacks/github.svg";
import { Globe } from "lucide-react";
import { toTitleCase } from "@/lib/utils";
import { Ref } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Projects({
  projects,
  ref,
}: {
  projects: any[] | undefined;
  ref: Ref<HTMLDivElement> | undefined;
}) {
  return (
    <div className="margin py-12 flex flex-col gap-4">
      <h2 className="text-4xl font-bold md:text-start text-center">Projects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4" ref={ref}>
        {projects
          ? projects.map((project, index) => (
              <Project project={project} key={index} />
            ))
          : Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-46 rounded-lg" />
            ))}
      </div>
    </div>
  );
}

function Project({ project }: { project: any }) {
  return (
    <Card className="w-full min-h-46 flex flex-col justify-between">
      <CardHeader>
        <div className="flex flex-col items-start gap-2">
          <h3 className="text-2xl font-bold">{project.name}</h3>
          <p className="text-sm text-neutral-400">{project.description}</p>
        </div>
      </CardHeader>
      <Separator />
      <CardFooter>
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            {project.stacks.map((stack: string, i: number) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <img
                    src={`/stacks/${stack}.svg`}
                    alt={stack}
                    className="w-6"
                    key={stack}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{toTitleCase(stack)}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="flex flex-row items-center justify-center h-full gap-2 w-fit">
            {project.link && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={project.source}
                    target="_blank"
                    aria-label="View source code"
                  >
                    <img src={Github.src} alt="Github" className="w-6 h-6" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View source code</p>
                </TooltipContent>
              </Tooltip>
            )}
            {project.source && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href={project.link}
                    target="_blank"
                    aria-label="Visit website"
                  >
                    <Globe className="w-6 h-6" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visit website</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
