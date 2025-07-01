"use client";

import { Button } from "@/components/ui/button";

export default function Banner() {
  return (
    <div className="flex flex-col gap-8 items-center justify-start md:pb-20 md:pt-36 pt-16 margin">
      <h1 className="md:text-8xl text-5xl italic font-bold flex flex-col">
        <span className="-translate-x-12">Full Stack</span>
        <span className="translate-x-12">Developer</span>
      </h1>
      <p className="md:text-3xl text-lg text-center">
        Front-end to Back-end covered.
        <br />
        Plan, create, deploy.
      </p>
      <div className="flex flex-row gap-4">
        <Button
          onClick={() => {
            console.log("contact me");
          }}
        >
          Contact Me
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            console.log("projects");
          }}
        >
          See Projects
        </Button>
      </div>
    </div>
  );
}
