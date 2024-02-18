import { query } from "./_generated/server";
import { mutation } from "./_generated/server";

import { v } from "convex/values";
let dateTime = new Date()


export const sign_in = query({
    args: {uuid: v.string(), password: v.string()},
        handler: async (ctx, args) => {
        const users = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("user_name"), args.uuid))
            .order("desc")
            .take(100);
        if(users.length != 1){
            return -1;
        }
        return users[0]["password"] == args.password;
    },
});

export const create_user = mutation({
  args: {uuid: v.string(), password: v.string()},
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("users", {
        user_name: args.uuid, password: args.password,
        time: dateTime.toISOString()
    });
    return newTaskId;
  },
});

