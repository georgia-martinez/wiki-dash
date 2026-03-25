import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../back-end/convex/_generated/api";
import { WinModal } from "../components/WinModal";
import { fetchWikiPage, getTitleFromWikiHref } from "../utils/mediaWikiApi";

export const GamePage = () => {
    const dailyChallenge = useQuery(api.challenges.getTodaysChallenge);
    const ensureTodaysChallenge = useMutation(api.challenges.ensureTodaysChallenge);
    const ensureKickSent = useRef(false);
    const puzzle: [string, string] | null =
        dailyChallenge ? [dailyChallenge.article1, dailyChallenge.article2] : null;
    const [pageTitle, setPageTitle] = useState("");

    useEffect(() => {
        if (dailyChallenge === null) {
            setLoading(false);
        } else if (puzzle && !pageTitle) {
            setPageTitle(puzzle[0]);
        }
    }, [puzzle, dailyChallenge]);

    const article2 = puzzle?.[1] ?? "";
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const challengeLoading = dailyChallenge === undefined;
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (challengeLoading || dailyChallenge !== null) return;
        if (ensureKickSent.current) return;
        ensureKickSent.current = true;
        void ensureTodaysChallenge().catch(() => {
            ensureKickSent.current = false;
        });
    }, [challengeLoading, dailyChallenge, ensureTodaysChallenge]);
    const [linksClicked, setLinksClicked] = useState<string[]>([]);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [won, setWon] = useState(false);
    const [showNonWikiAlert, setShowNonWikiAlert] = useState(false);

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
                            <Typography variant="h5" sx={{ fontWeight: "bold", fontVariantNumeric: "tabular-nums", minWidth: "4ch" }}>
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
            {(challengeLoading || loading) && (
                <Box display="flex" justifyContent="center" p={4}>
                    <CircularProgress />
                </Box>
            )}
            {!challengeLoading && !dailyChallenge && (
                <Alert severity="warning">No challenge set for today yet. Check back soon!</Alert>
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
        </Stack>
    );
};
