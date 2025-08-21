import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Stack } from "../app/dashboard/interfaces";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const stacks = await ctx.db.query("stacks").collect();
    return Promise.all(
      stacks.map(async (stack) => ({
        ...stack,
        // If the stack is an "image" its `body` is an `Id<"_storage">`
        ...(stack.image
          ? { image: await ctx.storage.getUrl(stack.image) }
          : {}),
      }))
    );
  },
});

export const getList = query({
  args: {
    ids: v.array(v.id("stacks")),
  },
  handler: async (ctx, args) => {
    const stack: Stack[] = [];
    for (const id of args.ids) {
      const s = await ctx.db.get(id);
      if (s)
        stack.push({
          ...s,
          // If the stack is an "image" its `body` is an `Id<"_storage">`
          ...(s.image ? { image: await ctx.storage.getUrl(s.image) } : {}),
        });
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
    image: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { id, name, href, image } = args;
    return await ctx.db.patch(id, {
      name,
      href,
      image,
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

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
