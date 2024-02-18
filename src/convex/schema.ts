// import { defineSchema, defineTable } from "convex/server";
// import { v } from "convex/values";

// export default defineSchema({
//   logs: defineTable({
//     time: v.string(),
//     buy_sell: v.boolean(),
//     amount: v.number(),
//     artist: v.id('artists'),
//   }),
//   artists: defineTable({
//     artist_name: v.string(),
//     amount : v.number(),
//     popularity : v.number(),
//   }),
//   users: defineTable({
//     time: v.string(),
//     user_name: v.string(),
//     password : v.string(),
//   }).index("by_token", ["tokenIdentifier"]),
// });