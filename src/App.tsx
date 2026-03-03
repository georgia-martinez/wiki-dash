import { Stack } from "@mui/material";
import { HomePage } from "./pages/HomePage";

export const App = () => {
    // TODO: Add routing here
    return (
        <Stack
            sx={{
                p: 4,
            }}
        >
            <HomePage />
        </Stack>
    );
};
