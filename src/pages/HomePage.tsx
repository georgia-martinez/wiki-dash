import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const WIKI_BASE = "https://en.wikipedia.org";

async function fetchRandomWikiTitle(): Promise<string> {
    const params = new URLSearchParams({
        action: "query",
        list: "random",
        rnnamespace: "0",
        rnlimit: "1",
        format: "json",
        origin: "*",
    });
    const res = await fetch(`${WIKI_API}?${params}`);
    if (!res.ok) throw new Error("Failed to fetch random page");
    const data = await res.json();
    const title = data.query?.random?.[0]?.title;
    if (!title) throw new Error("No random page returned");
    return title;
}

async function fetchWikiPage(
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
    // Fix relative links so they open on Wikipedia
    const html = raw.replace(/ href="\/wiki\//g, ` href="${WIKI_BASE}/wiki/`);
    return { html, title: pageToParse };
}

function getTitleFromWikiHref(href: string): string | null {
    try {
        const url = new URL(href, WIKI_BASE);
        if (url.origin !== WIKI_BASE || !url.pathname.startsWith("/wiki/"))
            return null;
        const title = url.pathname.slice(6); // "/wiki/".length
        return decodeURIComponent(title.replaceAll("_", " ")) || null;
    } catch {
        return null;
    }
}

export const HomePage = () => {
    const [pageTitle, setPageTitle] = useState("Wikipedia");
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [linksClicked, setLinksClicked] = useState<string[]>([]);

    const handleWikiContentClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (!link?.href) return;

            const title = getTitleFromWikiHref(link.href);

            if (!title) return;

            e.preventDefault();
            setLoading(true);
            setError(null);
            setPageTitle(title);

            const allLinksClicked = linksClicked.concat(title);

            setLinksClicked(allLinksClicked);

            localStorage.setItem(
                "linksClicked",
                JSON.stringify(allLinksClicked)
            );
        },
        [linksClicked]
    );

    useEffect(() => {
        let cancelled = false;
        fetchWikiPage(pageTitle)
            .then(({ html }) => {
                if (!cancelled) {
                    setHtml(html);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong"
                    );
                    setHtml(null);
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [pageTitle]);

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <img
                    src="/wikipedia_logo.png"
                    alt="Wikipedia"
                    style={{ maxWidth: 120 }}
                />
                <Typography variant="h2">WikiDash</Typography>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setLoading(true);
                        setError(null);
                        setPageTitle("random");
                    }}
                >
                    Random page
                </Button>
            </Stack>
            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {loading && (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && html && (
                <Box
                    className="wiki-content"
                    onClick={handleWikiContentClick}
                    sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                        p: 2,
                        "& a": { color: "primary.main", cursor: "pointer" },
                    }}
                >
                    <div
                        dangerouslySetInnerHTML={{ __html: html }}
                        style={{
                            fontFamily: "sans-serif",
                            fontSize: "0.95rem",
                            lineHeight: 1.6,
                        }}
                    />
                </Box>
            )}
        </Stack>
    );
};
