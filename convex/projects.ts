import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    link: v.union(v.string(), v.null()),
    source: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const { name, description, link, source } = args;
    return await ctx.db.insert("projects", {
      name,
      description,
      link,
      source,
      stacks: [],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.string(),
    description: v.string(),
    link: v.union(v.string(), v.null()),
    source: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const { id, name, description, link, source } = args;
    return await ctx.db.patch(id, {
      name,
      description,
      link,
      source,
    });
  },
});

export const destroy = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
