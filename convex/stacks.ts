import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stacks").collect();
  },
});

export const getList = query({
  args: {
    ids: v.array(v.id("stacks")),
  },
  handler: async (ctx, args) => {
    const stack = [];
    for (const id of args.ids) {
      const s = await ctx.db.get(id);
      if (s) stack.push(s);
    }
    return stack;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    href: v.string(),
  },
  handler: async (ctx, args) => {
    const { name, href } = args;
    return await ctx.db.insert("stacks", {
      name,
      href,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("stacks"),
    name: v.string(),
    href: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, name, href } = args;
    return await ctx.db.patch(id, {
      name,
      href,
    });
  },
});

export const destroy = mutation({
  args: {
    id: v.id("stacks"),
  },
  handler: async (ctx, args) => {
    const { id } = args;
    return await ctx.db.delete(id);
  },
});
