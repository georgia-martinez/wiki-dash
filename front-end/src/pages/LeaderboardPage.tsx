import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../back-end/convex/_generated/api";
import Scoreboard from "../components/Scoreboard";
import SortDropdown from "../components/SortDropdown";
import type { SortBy } from "../components/SortDropdown";

export const LeaderboardPage = () => {
    const [sortBy, setSortBy] = useState<SortBy>("time");
    const today = new Date().toISOString().split("T")[0];
    const [selectedDate, setSelectedDate] = useState<string>(today);
    const navigate = useNavigate();

    const challenge = useQuery(api.challenges.getChallengeByDate, { date: selectedDate });

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 8 }}>
            <Typography variant="h4" fontWeight="bold">
                Leaderboard
            </Typography>
            <Box sx={{ mt: 2, width: "100%", maxWidth: 150 }}>
                <Button variant="contained" onClick={() => navigate("/")} fullWidth>
                    Back to Home
                </Button>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
                <SortDropdown value={sortBy} onChange={setSortBy} />
                <TextField
                    type="date"
                    size="small"
                    label="Filter by date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
                />
                <Button size="small" onClick={() => setSelectedDate(today)}>
                    Today
                </Button>
            </Stack>
            {challenge && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    from <strong>{challenge.article1}</strong> to <strong>{challenge.article2}</strong>
                </Typography>
            )}
            <Scoreboard sortBy={sortBy} selectedDate={selectedDate} />
        </Stack>
    );
};
