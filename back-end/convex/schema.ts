import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  scores: defineTable({
    username: v.string(),
    pagesClicked: v.number(),
    timeSpent: v.number(),
    date: v.optional(v.string()),
  }),
  dailyChallenge: defineTable({
    date: v.string(), // YYYY-MM-DD
    article1: v.string(),
    article2: v.string(),
  }).index("by_date", ["date"]),
});

//make schema
//make functions to get schema