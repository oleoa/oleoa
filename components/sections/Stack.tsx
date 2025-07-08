/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import Image from "next/image";
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

import Me from "@/lib/assets/images/me.png";
import Github from "@/public/stacks/github.svg";

export default function Stack({ stacks }: { stacks: any }) {
  return (
    <div className="margin py-20 flex md:flex-row flex-col gap-8">
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
            <div className="flex flex-row gap-4 items-center">
              <h2 className="text-2xl font-bold">Leonardo Abreu</h2>
              <a href="https://github.com/oleoa" target="_blank">
                <Image src={Github} alt="Github" className="w-6 h-6" />
              </a>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="flex flex-row md:gap-4 gap-2 border-2 px-4 py-2 rounded-lg items-center text-sm cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(
                    "leonardo.abreu.de.paulo@gmail.com"
                  );
                }}
                aria-label="Copy email"
              >
                leonardo.abreu.de.paulo@gmail.com
              </button>
            </TooltipTrigger>
            <TooltipContent hideWhenDetached={false}>
              <p>Click to copy email</p>
            </TooltipContent>
          </Tooltip>
        </CardFooter>
      </Card>
      <div className="space-y-4">
        <div className="flex flex-row items-center gap-4">
          <h2 className="text-4xl font-bold md:text-start text-center">
            Stack
          </h2>
        </div>
        <div className="flex flex-wrap md:justify-start justify-center gap-4">
          {stacks.map((item: any) => (
            <StackCard key={item.name} stack={item} />
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
