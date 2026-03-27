import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
    args: {
        username: v.string(),
        pagesClicked: v.number(),
        timeSpent: v.number(),
        date: v.string(),
        path: v.optional(v.array(v.string())),
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

export const clearAll = mutation({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("scores").collect();
        await Promise.all(all.map((s) => ctx.db.delete(s._id)));
    },
});