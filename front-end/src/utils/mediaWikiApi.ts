
const WIKI_API = "https://en.wikipedia.org/w/api.php";
const WIKI_BASE = "https://en.wikipedia.org";

/**
 * Fetches a single random Wikipedia article title.
 */
export async function fetchRandomWikiTitle(): Promise<string> {
    const [title] = await getRandomWikiPages();
    if (!title) throw new Error("No random page returned");
    return title;
}

const WIKIMEDIA_API = "https://wikimedia.org/api/rest_v1";

const EXCLUDED_TITLES = new Set([
    "Main Page",
    "Special:Search",
    "Wikipedia:Contents",
]);

/**
 * Fetches the top viewed Wikipedia article titles from the previous day.
 */
async function fetchPopularTitles(): Promise<string[]> {
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
    const articles = data.items?.[0]?.articles ?? [];

    return articles
        .map((a: { article: string }) => a.article.replaceAll("_", " "))
        .filter(
            (title: string) =>
                !EXCLUDED_TITLES.has(title) &&
                !title.startsWith("Special:") &&
                !title.startsWith("Wikipedia:") &&
                !title.startsWith("Portal:")
        );
}

/**
 * Returns two distinct random Wikipedia article titles as a tuple.
 * Keeps requesting until article1 !== article2.
 */
const MAX_TITLE_LENGTH = 20;

export async function getRandomWikiPages(): Promise<[string, string]> {
    const pool = await fetchPopularTitles();
    const filtered = pool.filter((t) => t.length <= MAX_TITLE_LENGTH);
    if (filtered.length < 2) throw new Error("Not enough popular articles");

    const i = Math.floor(Math.random() * filtered.length);
    let j = Math.floor(Math.random() * (filtered.length - 1));
    if (j >= i) j++;

    return [filtered[i], filtered[j]];
}

/**
 * Fetches a Wikipedia page's HTML by title. If title is "random", fetches a random page first.
 */
export async function fetchWikiPage(
    title: string
): Promise<{ html: string; title: string }> {
    const pageToParse =
        title.trim().toLowerCase() === "random"
            ? await fetchRandomWikiTitle()
            : title;

    const params = new URLSearchParams({
        action: "parse",
        page: pageToParse,
        prop: "text",
        format: "json",
        origin: "*",
    });
    const res = await fetch(`${WIKI_API}?${params}`);
    if (!res.ok) throw new Error("Failed to fetch page");
    const data = await res.json();
    if (data.error) throw new Error(data.error.info || data.error.code);
    const raw = data.parse.text["*"] as string;
    const html = raw.replace(/ href="\/wiki\//g, ` href="${WIKI_BASE}/wiki/`);
    return { html, title: pageToParse };
}

/**
 * Parses a Wikipedia href (e.g. from a link in parsed HTML) and returns the article title, or null.
 */
export function getTitleFromWikiHref(href: string): string | null {
    try {
        const url = new URL(href, WIKI_BASE);
        if (
            url.origin !== WIKI_BASE ||
            !url.pathname.startsWith("/wiki/")
        )
            return null;
        const title = url.pathname.slice(6);
        return decodeURIComponent(title.replaceAll("_", " ")) || null;
    } catch {
        return null;
    }
}
