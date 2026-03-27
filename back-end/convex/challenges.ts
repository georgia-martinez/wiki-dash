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

/** Wikimedia often lags 1–2+ days before top pageviews exist for a calendar day (404 + ~325B JSON). */
async function fetchTopArticlesForRecentDay(): Promise<{ article: string }[]> {
    for (let daysBack = 1; daysBack <= 14; daysBack++) {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() - daysBack);
        const y = d.getUTCFullYear();
        const month = String(d.getUTCMonth() + 1).padStart(2, "0");
        const day = String(d.getUTCDate()).padStart(2, "0");
        const url = `${WIKIMEDIA_API}/metrics/pageviews/top/en.wikipedia/all-access/${y}/${month}/${day}`;
        const res = await fetch(url);
        if (!res.ok) continue;
        let data: { items?: { articles?: { article: string }[] }[] };
        try {
            data = await res.json();
        } catch {
            continue;
        }
        const articles = data.items?.[0]?.articles ?? [];
        if (articles.length >= 10) return articles;
    }
    throw new Error("No Wikimedia pageview top data for the last two weeks (API lag or outage)");
}

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
        const articles = await fetchTopArticlesForRecentDay();

        const filtered = articles
            .map((a) => a.article.replaceAll("_", " "))
            .filter(
                (title) =>
                    !EXCLUDED_TITLES.has(title) &&
                    !EXCLUDED_PREFIXES.some((p) => title.startsWith(p)) &&
                    title.length <= MAX_TITLE_LENGTH
            );

        if (filtered.length < 2) throw new Error("Not enough popular articles");

        const shuffled = filtered.sort(() => Math.random() - 0.5);
        let article1: string | null = null;
        let article2: string | null = null;

        for (const title of shuffled) {
            if (await isNSFW(title)) continue;
            if (!article1) { article1 = title; continue; }
            article2 = title;
            break;
        }

        if (!article1 || !article2) throw new Error("Not enough safe articles");

        await ctx.runMutation(internal.challenges.setDailyChallenge, {
            article1,
            article2,
        });
    },
});
