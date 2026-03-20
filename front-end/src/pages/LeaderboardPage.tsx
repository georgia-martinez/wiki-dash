import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import Scoreboard from "../components/Scoreboard";
import SortDropdown from "../components/SortDropdown";
import type { SortBy } from "../components/SortDropdown";

export const LeaderboardPage = () => {
    const [sortBy, setSortBy] = useState<SortBy>("time");

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 8 }}>
            <Typography variant="h4" fontWeight="bold">
                Leaderboard
            </Typography>
            <Box sx={{ mt: 2 }}>
                <SortDropdown value={sortBy} onChange={setSortBy} />
            </Box>
            <Scoreboard sortBy={sortBy} />
        </Stack>
    );
};
