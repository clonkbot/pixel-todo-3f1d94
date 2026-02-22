import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
    userId: v.id("users"),
    createdAt: v.number(),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  }).index("by_user", ["userId"]),
});
