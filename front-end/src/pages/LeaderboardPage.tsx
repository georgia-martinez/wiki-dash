import { Stack, Typography } from "@mui/material";

export const LeaderboardPage = () => {
    return (
        <Stack alignItems="center" justifyContent="center" sx={{ mt: 8 }}>
            <Typography variant="h4" fontWeight="bold">
                Leaderboard
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                Coming soon!
            </Typography>
        </Stack>
    );
};
