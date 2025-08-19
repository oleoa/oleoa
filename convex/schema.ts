import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  projects: defineTable({
    name: v.string(),
    description: v.string(),
    link: v.string(),
    source: v.string(),
    stack: v.array(v.string()),
  }),
  users: defineTable({
    name: v.string(),
    href: v.string(),
    src: v.string(),
  }),
});
