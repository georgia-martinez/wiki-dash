import { internalAction, internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const WIKIMEDIA_API = "https://wikimedia.org/api/rest_v1";
const MAX_TITLE_LENGTH = 20;
const EXCLUDED_PREFIXES = ["Special:", "Wikipedia:", "Portal:"];
const EXCLUDED_TITLES = new Set(["Main Page", "Special:Search", "Wikipedia:Contents"]);
const NSFW_CATEGORIES = [
    "Category:Pornography",
    "Category:Pornographic films",
    "Category:Pornographic film series",
    "Category:Sexual fetishism",
    "Category:Adult websites",
    "Category:Sex industry",
];

async function isNSFW(title: string): Promise<boolean> {
    const encoded = encodeURIComponent(title.replaceAll(" ", "_"));
    const clcategories = NSFW_CATEGORIES.map(encodeURIComponent).join("|");
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encoded}&prop=categories&cllimit=50&clcategories=${clcategories}&format=json`;
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = await res.json();
    const pages = Object.values(data.query?.pages ?? {}) as { categories?: unknown[] }[];
    return pages.some((p) => (p.categories?.length ?? 0) > 0);
}

export const getTodaysChallenge = query({
    args: {},
    handler: async (ctx) => {
        const today = new Date().toISOString().slice(0, 10);
        return await ctx.db
            .query("dailyChallenge")
            .withIndex("by_date", (q) => q.eq("date", today))
            .unique();
    },
});

/** If the cron missed (e.g. backend was down), the first client without a row schedules the same fetch action. */
export const ensureTodaysChallenge = mutation({
    args: {},
    handler: async (ctx) => {
        const today = new Date().toISOString().slice(0, 10);
        const existing = await ctx.db
            .query("dailyChallenge")
            .withIndex("by_date", (q) => q.eq("date", today))
            .unique();
        if (existing) return;
        await ctx.scheduler.runAfter(0, internal.challenges.fetchAndSetDailyChallenge, {});
    },
});

export const getChallengeByDate = query({
    args: { date: v.string() },
    handler: async (ctx, { date }) => {
        return await ctx.db
            .query("dailyChallenge")
            .withIndex("by_date", (q) => q.eq("date", date))
            .unique();
    },
});

export const setDailyChallenge = internalMutation({
    args: { article1: v.string(), article2: v.string() },
    handler: async (ctx, { article1, article2 }) => {
        const today = new Date().toISOString().slice(0, 10);
        const existing = await ctx.db
            .query("dailyChallenge")
            .withIndex("by_date", (q) => q.eq("date", today))
            .unique();
        if (existing) return;
        await ctx.db.insert("dailyChallenge", { date: today, article1, article2 });
    },
});

export const fetchAndSetDailyChallenge = internalAction({
    args: {},
    handler: async (ctx) => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const year = yesterday.getFullYear();
        const month = String(yesterday.getMonth() + 1).padStart(2, "0");
        const day = String(yesterday.getDate()).padStart(2, "0");

        const res = await fetch(
            `${WIKIMEDIA_API}/metrics/pageviews/top/en.wikipedia/all-access/${year}/${month}/${day}`
        );
        if (!res.ok) throw new Error("Failed to fetch popular pages");
        const data = await res.json();
        const articles: { article: string }[] = data.items?.[0]?.articles ?? [];

        const filtered = articles
            .map((a) => a.article.replaceAll("_", " "))
            .filter(
                (title) =>
                    !EXCLUDED_TITLES.has(title) &&
                    !EXCLUDED_PREFIXES.some((p) => title.startsWith(p)) &&
                    title.length <= MAX_TITLE_LENGTH
            );

        if (filtered.length < 2) throw new Error("Not enough popular articles");

        const safeFiltered: string[] = [];
        for (const title of filtered) {
            if (!(await isNSFW(title))) safeFiltered.push(title);
        }
        if (safeFiltered.length < 2) throw new Error("Not enough safe articles");

        const i = Math.floor(Math.random() * safeFiltered.length);
        let j = Math.floor(Math.random() * (safeFiltered.length - 1));
        if (j >= i) j++;

        await ctx.runMutation(internal.challenges.setDailyChallenge, {
            article1: safeFiltered[i],
            article2: safeFiltered[j],
        });
    },
});
