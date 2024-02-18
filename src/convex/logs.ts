import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const post_log = mutation({
  args: {
        buy_sell: v.boolean(),
        amount: v.number(),
        artist: v.id('artists'),
        time: v.string(),
    },
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("logs", {
        buy_sell: args.buy_sell, amount: args.amount, artist: args.artist, time: args.time,
    });
    return newTaskId;
  },
});