import { Stack, Typography } from "@mui/material";
import Scoreboard from "../components/Scoreboard";

export const LeaderboardPage = () => {
    return (
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 8 }}>
            <Typography variant="h4" fontWeight="bold">
                Leaderboard
            </Typography>
            <Scoreboard/>
        </Stack>
    );
};
