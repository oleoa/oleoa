/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import Github from "@/public/stacks/github.svg";
import { Globe } from "lucide-react";

export default function Projects({ projects }: { projects: any[] }) {
  return (
    <div className="py-20 margin flex flex-col gap-8">
      <div className="flex flex-row items-center gap-4">
        <h2 className="text-4xl font-bold md:text-start text-center">
          Projects
        </h2>
      </div>
      <div className="flex flex-row flex-wrap gap-4 overflow-hidden">
        {projects.map((project, index) => (
          <Project project={project} key={index} />
        ))}
      </div>
    </div>
  );
}

function Project({ project }: { project: any }) {
  return (
    <Card className="w-fit px-2">
      <CardHeader>
        <div className="flex flex-row items-center justify-between gap-2">
          <h3 className="text-2xl font-bold">{project.name}</h3>
          <div className="flex flex-row items-center justify-center h-full gap-2">
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
        <p className="text-sm text-neutral-400 pt-1">{project.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row flex-wrap gap-4">
          {project.stacks.map((stack: string) => (
            <img
              src={`/stacks/${stack}.svg`}
              alt={stack}
              className="w-10 h-10"
              key={stack}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
