import { query } from "./_generated/server";

export const post_log = query({
    args: {},
    handler: async (ctx: any) => {
        return await ctx.db.query("tasks").collect();
    },
});