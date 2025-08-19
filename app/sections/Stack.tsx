/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import Me from "@/lib/assets/me.png";
import { GithubIcon, LinkedinIcon } from "lucide-react";

export default function Stack({ stacks }: { stacks: any[] | undefined }) {
  return (
    <div className="margin py-20 gap-8 md:grid md:grid-cols-3 flex flex-col">
      <Card>
        <CardContent>
          <img
            src={Me.src}
            alt="Leonardo"
            className="rounded-lg w-full object-cover"
          />
        </CardContent>
        <CardHeader>
          <div className="rounded-lg flex flex-col items-start gap-4 h-fit">
            <div className="flex flex-row gap-2 items-center">
              <h2 className="text-2xl font-bold pr-2">Leonardo Abreu</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="https://github.com/oleoa" target="_blank">
                    <LinkedinIcon />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open my LinkedIn Account</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a href="https://github.com/oleoa" target="_blank">
                    <GithubIcon />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open my Github Account</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="flex flex-col gap-2">
              <p>
                I&apos;m a full stack developer with a passion for building web
                applications.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="w-fit flex gap-2 items-center border-2 py-2 px-4 rounded-lg border-green-600 text-green-600">
            <span className="animate-pulse flex items-center justify-center w-2 h-2 rounded-full bg-green-600"></span>
            <p>Avaiable for work</p>
          </div>
        </CardFooter>
      </Card>
      <div className="space-y-4 md:col-span-2">
        <h2 className="text-4xl font-bold md:text-start text-center">Stack</h2>
        <div className="flex flex-wrap md:justify-start justify-center gap-4">
          {stacks
            ? stacks.map((item: any) => (
                <StackCard key={item.name} stack={item} />
              ))
            : Array.from({ length: 24 }).map((_, i: number) => (
                <Skeleton key={i} className="h-24 w-24 rounded-lg" />
              ))}
        </div>
      </div>
    </div>
  );
}

function StackCard({ stack }: { stack: any }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={stack.href}
          target="_blank"
          aria-label="Visit {stack.name} website"
          className="flex flex-col items-center justify-center p-4 border transition-all duration-300 rounded-lg w-24 h-24 cursor-pointer hover:bg-neutral-200"
        >
          <img src={`/stacks/${stack.src}.svg`} alt={stack.name} className="" />
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p>{stack.name}</p>
      </TooltipContent>
    </Tooltip>
  );
}
