import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  scores: defineTable({
    username: v.string(),
    pagesClicked: v.number(),
    timeSpent: v.number(),
  }),
});

//make schema
//make functions to get schema