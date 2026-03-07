import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { WinModal } from "../components/WinModal";
import { fetchWikiPage, getRandomWikiPages, getTitleFromWikiHref } from "../utils/mediaWikiApi";

export const GamePage = () => {
    const [puzzle, setPuzzle] = useState<[string, string] | null>(null);
    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
        let cancelled = false;
        getRandomWikiPages().then(([a1, a2]) => {
            if (!cancelled) {
                setPuzzle([a1, a2]);
                setPageTitle(a1);
                console.log(`a1: ${a1}, a2: ${a2}`);
            }
        });
        return () => {
            cancelled = true;
        };
    }, []);

    const article2 = puzzle?.[1] ?? "";
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [linksClicked, setLinksClicked] = useState<string[]>([]);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [won, setWon] = useState(false);

    useEffect(() => {
        if (loading || won) return;
        const id = setInterval(() => {
            setElapsedSeconds((s) => s + 1);
        }, 1000);
        return () => clearInterval(id);
    }, [loading, won]);

    useEffect(() => {
        if (article2 && pageTitle === article2) {
            setWon(true);
        }
    }, [pageTitle, article2]);

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

            localStorage.setItem("linksClicked", JSON.stringify(allLinksClicked));
        },
        [linksClicked]
    );

    useEffect(() => {
        if (!pageTitle) return;
        let cancelled = false;
        fetchWikiPage(pageTitle)
            .then(({ html }) => {
                if (!cancelled) {
                    setHtml(html);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Something went wrong");
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
            <WinModal
                open={won}
                startArticle={puzzle?.[0] ?? ""}
                endArticle={puzzle?.[1] ?? ""}
                linksClicked={linksClicked.length}
                elapsedSeconds={elapsedSeconds}
            />
            {/* Sticky header */}
            <Stack
                sx={{
                    gap: 1,
                    position: "sticky",
                    top: 0,
                    zIndex: 1,
                    backgroundColor: "background.paper",
                    py: 1,
                    flexShrink: 0,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Stack direction="row" justifyContent="space-between" gap={1}>
                    {/* Get from article1 to article2 */}
                    <Stack direction="row" gap={1}>
                        <Typography variant="h5">Get from</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {puzzle?.[0]}
                        </Typography>
                        <Typography variant="h5">to</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {puzzle?.[1]}
                        </Typography>
                    </Stack>
                    <Stack direction="row" gap={1}>
                        {/* Links clicked */}
                        <Stack direction="row" gap={1}>
                            <Typography variant="h5">Links clicked:</Typography>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                {linksClicked.length}
                            </Typography>
                        </Stack>
                        {/* Timer */}
                        <Stack direction="row" gap={1}>
                            <Typography variant="h5">Time:</Typography>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                {Math.floor(elapsedSeconds / 60)}:
                                {String(elapsedSeconds % 60).padStart(2, "0")}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between" gap={1}>
                    {/* Current article */}
                    <Stack direction="row" gap={1}>
                        <Typography variant="h5">Current article:</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {pageTitle}
                        </Typography>
                    </Stack>
                    {/* Reset button */}
                    <Stack direction="row" gap={1} alignItems="center">
                        <Typography variant="body2">
                            NOTE: Resetting will not reset links clicked or time
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                if (puzzle?.[0] && pageTitle !== puzzle[0]) {
                                    setPageTitle(puzzle[0]);
                                    setLoading(true);
                                    setError(null);
                                }
                            }}
                        >
                            Reset
                        </Button>
                    </Stack>
                </Stack>
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
