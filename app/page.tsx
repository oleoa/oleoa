"use client";

import Banner from "@/app/sections/Banner";
import Stack from "@/app/sections/Stack";
import Projects from "@/app/sections/Projects";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

import { useRef } from "react";

export default function Home() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const handleProjectsScroll = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const projects = useQuery(api.projects.get);
  const stack = useQuery(api.stack.get);

  return (
    <main>
      <Banner handleProjectsScroll={handleProjectsScroll} />
      <Stack stacks={stack} />
      <Projects projects={projects} ref={targetRef} />
    </main>
  );
}
