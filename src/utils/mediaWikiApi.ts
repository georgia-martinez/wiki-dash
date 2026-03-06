
const WIKI_API = "https://en.wikipedia.org/w/api.php";
const WIKI_BASE = "https://en.wikipedia.org";

/**
 * Fetches a single random Wikipedia article title.
 */
export async function fetchRandomWikiTitle(): Promise<string> {
    const titles = await fetchRandomTitles(1);
    const title = titles[0];
    if (!title) throw new Error("No random page returned");
    return title;
}

/**
 * Fetches random Wikipedia article titles from the MediaWiki API.
 * @param count - Number of distinct titles to return (default 2)
 */
export async function fetchRandomTitles(count: number): Promise<string[]> {
    const params = new URLSearchParams({
        action: "query",
        list: "random",
        rnnamespace: "0",
        rnlimit: String(Math.max(count * 2, 10)),
        format: "json",
        origin: "*",
    });
    const res = await fetch(`${WIKI_API}?${params}`);
    if (!res.ok) throw new Error("Failed to fetch random pages");
    const data = await res.json();
    const items = data.query?.random ?? [];
    if (!Array.isArray(items) || items.length === 0)
        throw new Error("No random pages returned");
    return items.map((item: { title: string }) => item.title);
}

/**
 * Returns two distinct random Wikipedia article titles as a tuple.
 * Keeps requesting until article1 !== article2.
 */
const MAX_TITLE_LENGTH = 20;

export async function getRandomWikiPages(): Promise<[string, string]> {
    const distinct: string[] = [];
    while (distinct.length < 2) {
        const titles = await fetchRandomTitles(2);

        for (const title of titles) {
            if (title && !distinct.includes(title)) {
                distinct.push(title);
                if (distinct.length === 2) break;
            }
        }
        if (
            distinct.length === 2 &&
            (distinct[0].length > MAX_TITLE_LENGTH ||
                distinct[1].length > MAX_TITLE_LENGTH)
        ) {
            distinct.length = 0;
        }
    }
    return [distinct[0], distinct[1]];
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
