import { Stack } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { GamePage } from "./pages/GamePage";
import { HomePage } from "./pages/HomePage";

export const App = () => {
    return (
        <Stack
            sx={{
                p: 4,
            }}
        >
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/game" element={<GamePage />} />
            </Routes>
        </Stack>
    );
};
