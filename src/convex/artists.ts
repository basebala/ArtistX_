import { query } from "./_generated/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const get_artists = query({
    args: {},
    handler: async (ctx: any) => {
        return await ctx.db.query("artists").collect();
    },
});

export const get_artist_stats = query({
    args: {},
    handler: async (ctx: any) => {
        return await ctx.db.query("artists").collect();
    },
});

export const get_artist_coin = query({
    args: {artist: v.string()},

    handler: async (ctx, args) => {
        const artist = await ctx.db
            .query("artists")
            .filter((q) => q.eq(q.field("artist_name"), args.artist))
            .order("desc")
            .take(100);
        if(artist.length != 1){
            return -1;
        }
        return artist[0]["amount"];
    },
});

const default_starting_amnt = 1000;

export const add_artist = mutation({
    args: {artist: v.string(), amount: v.number(), popularity: v.number()},
    handler: async (ctx, args) => {
        const newTaskId = await ctx.db.insert("artists", {
            artist_name: args.artist, amount: args.amount, popularity: args.popularity,
        });
        return newTaskId;
  },
});