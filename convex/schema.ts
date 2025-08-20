import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    link: v.union(v.string(), v.null()),
    source: v.union(v.string(), v.null()),
    stacks: v.array(v.string()),
  }),
  stack: defineTable({
    name: v.string(),
    href: v.string(),
    src: v.string(),
  }),
});
