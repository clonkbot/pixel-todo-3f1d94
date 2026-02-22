import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    text: v.string(),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("todos", {
      text: args.text,
      completed: false,
      userId,
      createdAt: Date.now(),
      priority: args.priority || "medium",
    });
  },
});

export const toggle = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { completed: !todo.completed });
  },
});

export const remove = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const updateText = mutation({
  args: { id: v.id("todos"), text: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const todo = await ctx.db.get(args.id);
    if (!todo || todo.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { text: args.text });
  },
});

export const stats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { total: 0, completed: 0, pending: 0 };
    const todos = await ctx.db
      .query("todos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const completed = todos.filter((t) => t.completed).length;
    return {
      total: todos.length,
      completed,
      pending: todos.length - completed,
    };
  },
});
