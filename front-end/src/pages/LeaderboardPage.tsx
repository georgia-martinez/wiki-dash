import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useQuery } from "convex/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../back-end/convex/_generated/api";
import { ArticleTag } from "../components/ArticleTag";
import { ErrorBoundary } from "../components/ErrorBoundary";
import Scoreboard from "../components/Scoreboard";
import type { SortBy } from "../components/SortDropdown";
import SortDropdown from "../components/SortDropdown";

const ChallengeInfo = ({ date }: { date: string }) => {
    const challenge = useQuery(api.challenges.getChallengeByDate, { date });
    if (!challenge) return null;
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={1.5}
            sx={{ mt: 2, width: "100%" }}
        >
            <ArticleTag label={challenge.article1} />
            <Typography color="text.secondary">→</Typography>
            <ArticleTag label={challenge.article2} />
        </Stack>
    );
};

export const LeaderboardPage = () => {
    const [sortBy, setSortBy] = useState<SortBy>("time");
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const navigate = useNavigate();

    return (
        <Stack
            sx={{
                mt: 8,
                mx: "auto",
                width: "100%",
                maxWidth: 640,
                px: { xs: 2, sm: 3 },
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
                sx={{ width: "100%" }}
            >
                <Typography variant="h4" fontWeight="bold" component="h1">
                    Leaderboard
                </Typography>
                <Button variant="contained" onClick={() => navigate("/")} sx={{ flexShrink: 0 }}>
                    Back to Home
                </Button>
            </Stack>
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ mt: 2, width: "100%" }}
            >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <SortDropdown value={sortBy} onChange={setSortBy} />
                </Box>
                <TextField
                    type="date"
                    size="small"
                    label="Filter by date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    fullWidth
                    sx={{ flex: 1, minWidth: 0 }}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
                />
                <Button variant="outlined" onClick={() => setSelectedDate(today)} sx={{ flexShrink: 0 }}>
                    Today
                </Button>
            </Stack>
            <ErrorBoundary message="Error loading leaderboard. Please try again later.">
                <Stack alignItems="center" sx={{ width: "100%" }}>
                    <ChallengeInfo date={selectedDate} />
                    <Scoreboard sortBy={sortBy} selectedDate={selectedDate} />
                </Stack>
            </ErrorBoundary>
        </Stack>
    );
};
