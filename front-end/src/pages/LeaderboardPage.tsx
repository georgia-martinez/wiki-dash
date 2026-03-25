import { useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Scoreboard from "../components/Scoreboard";
import SortDropdown from "../components/SortDropdown";
import type { SortBy } from "../components/SortDropdown";

export const LeaderboardPage = () => {
    const [sortBy, setSortBy] = useState<SortBy>("time");
    const navigate = useNavigate();

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
            <Box sx={{ mt: 2 }}>
                <SortDropdown value={sortBy} onChange={setSortBy} />
            </Box>
            <Scoreboard sortBy={sortBy} />
        </Stack>
    );
};
