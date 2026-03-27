import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../back-end/convex/_generated/api";
import { WinModal } from "../components/WinModal";
import { fetchWikiPage, getRandomWikiPages, getTitleFromWikiHref } from "../utils/mediaWikiApi";

export const GamePage = () => {
    const [searchParams] = useSearchParams();
    const isRandom = searchParams.get("mode") === "random";

    const dailyChallenge = useQuery(api.challenges.getTodaysChallenge);
    const ensureTodaysChallenge = useMutation(api.challenges.ensureTodaysChallenge);
    const ensureKickSent = useRef(false);
    const [randomPuzzle, setRandomPuzzle] = useState<[string, string] | null>(null);
    const [randomLoading, setRandomLoading] = useState(isRandom);

    useEffect(() => {
        if (!isRandom) return;
        getRandomWikiPages()
            .then((pages) => {
                setRandomPuzzle(pages);
                setRandomLoading(false);
            })
            .catch(() => {
                setRandomLoading(false);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const puzzle: [string, string] | null = isRandom
        ? randomPuzzle
        : dailyChallenge ? [dailyChallenge.article1, dailyChallenge.article2] : null;

    /** User navigation override; empty means "use puzzle start article" (avoids setState-in-effect sync). */
    const [pageTitle, setPageTitle] = useState("");
    const currentArticle = pageTitle || puzzle?.[0] || "";
    const article2 = puzzle?.[1] ?? "";
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const challengeLoading = isRandom ? randomLoading : dailyChallenge === undefined;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (dailyChallenge === undefined || dailyChallenge !== null) return;
        if (ensureKickSent.current) return;
        ensureKickSent.current = true;
        void ensureTodaysChallenge().catch(() => {});
    }, [dailyChallenge, ensureTodaysChallenge]);
    
    const [linksClicked, setLinksClicked] = useState<string[]>([]);
    const elapsedSecondsRef = useRef(0);
    const timerDisplayRef = useRef<HTMLSpanElement>(null);
    const [won, setWon] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [showNonWikiAlert, setShowNonWikiAlert] = useState(false);

    useEffect(() => {
        if (loading || won) return;
        const id = setInterval(() => {
            elapsedSecondsRef.current += 1;
            const s = elapsedSecondsRef.current;
            if (timerDisplayRef.current) {
                timerDisplayRef.current.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
            }
        }, 1000);
        return () => clearInterval(id);
    }, [loading, won]);

    useEffect(() => {
        if (article2 && currentArticle === article2) {
            setElapsedSeconds(elapsedSecondsRef.current);
            setWon(true);
        }
    }, [currentArticle, article2]);

    const handleWikiContentClick = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            const target = e.target as HTMLElement;
            const link = target.closest("a");

            if (!link?.href) return;

            e.preventDefault();

            const title = getTitleFromWikiHref(link.href);

            if (!title) {
                setShowNonWikiAlert(true);
                return;
            }
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
        if (!currentArticle) return;
        let cancelled = false;
        void (async () => {
            setLoading(true);
            try {
                const { html: nextHtml } = await fetchWikiPage(currentArticle);
                if (!cancelled) setHtml(nextHtml);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Something went wrong");
                    setHtml(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [currentArticle]);

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <WinModal
                open={won}
                startArticle={puzzle?.[0] ?? ""}
                endArticle={puzzle?.[1] ?? ""}
                linksClicked={linksClicked.length}
                elapsedSeconds={elapsedSeconds}
                isRandom={isRandom}
            />
            {/* Header */}
            <Stack
                sx={{
                    gap: 1,
                    backgroundColor: "background.paper",
                    py: 1,
                    px: 4,
                    flexShrink: 0,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Stack direction="row" justifyContent="space-between" gap={1}>
                    {/* Get from article1 to article2 */}
                    <Stack direction="row" gap={1}>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {puzzle?.[0]}
                        </Typography>
                        <Typography variant="h5">➡️</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {puzzle?.[1]}
                        </Typography>
                    </Stack>
                    <Stack direction="row" gap={2}>
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
                            <Typography
                                component="span"
                                variant="h5"
                                sx={{
                                    fontWeight: "bold",
                                    fontVariantNumeric: "tabular-nums",
                                    minWidth: "4ch",
                                }}
                            >
                                <span ref={timerDisplayRef}>0:00</span>
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between" gap={1}>
                    {/* Current article */}
                    <Stack direction="row" gap={1}>
                        <Typography variant="h5">Current article:</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                            {currentArticle}
                        </Typography>
                    </Stack>
                    {/* Reset button */}
                    <Stack direction="row" gap={1} alignItems="center">
                        <Typography variant="body2">
                            NOTE: Will reset links clicked but not time
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                if (puzzle?.[0] && currentArticle !== puzzle[0]) {
                                    setPageTitle("");
                                    setLoading(true);
                                    setError(null);
                                    setLinksClicked([]);
                                }
                            }}
                        >
                            Reset
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
            {/* Scrollable content area */}
            <Box sx={{ flex: 1, overflowY: "auto", px: 4, py: 2 }}>
                <Stack spacing={2}>
                    {error && (
                        <Alert severity="error" onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}
                    {(challengeLoading || (loading && !!currentArticle)) && (
                        <Box display="flex" justifyContent="center" p={4}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!challengeLoading && !dailyChallenge && (
                        <Alert severity="warning">
                            No challenge set for today yet. Check back soon!
                        </Alert>
                    )}
                    {html && (
                        <Box
                            display={loading ? "none" : "block"}
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
            </Box>
            <Snackbar
                open={showNonWikiAlert}
                autoHideDuration={3000}
                onClose={() => setShowNonWikiAlert(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="warning" onClose={() => setShowNonWikiAlert(false)}>
                    You can only follow links to other Wikipedia articles!
                </Alert>
            </Snackbar>
        </Box>
    );
};
