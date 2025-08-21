import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stacks: defineTable({
    name: v.string(),
    href: v.string(),
    image: v.optional(v.id("_storage")),
  }),
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    link: v.union(v.string(), v.null()),
    source: v.union(v.string(), v.null()),
    stack: v.array(v.id("stacks")),
  }),
});
