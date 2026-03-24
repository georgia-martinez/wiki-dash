import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    username: v.string(),
    pagesClicked: v.number(),
    timeSpent: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("scores", args);
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("scores").collect();
  },
});