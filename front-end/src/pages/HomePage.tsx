import { SignInButton, UserButton, useUser } from "@clerk/react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { PhotoViewer } from "../components/PhotoViewer";

export const HomePage = () => {
    const { isSignedIn } = useUser();

    return (
        <Stack sx={{ px: 20, gap: 2, justifyContent: "center" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" gap={1}>
                    <Button
                        component={Link}
                        to="/game"
                        variant="contained"
                        color="primary"
                        sx={{ width: "fit-content" }}
                    >
                        Start Today's WikiDash
                    </Button>
                    <Button
                        component={Link}
                        to="/game?mode=random"
                        variant="outlined"
                        sx={{ width: "fit-content" }}
                    >
                        Random Game
                    </Button>
                    <Button
                        component={Link}
                        to="/leaderboard"
                        variant="outlined"
                        sx={{ width: "fit-content" }}
                    >
                        🥇 Leaderboard
                    </Button>
                </Stack>
                <Stack direction="row" gap={1} alignItems="center">
                    {isSignedIn ? (
                        <UserButton />
                    ) : (
                        <SignInButton mode="modal">
                            <Button variant="contained" color="primary">
                                Sign In
                            </Button>
                        </SignInButton>
                    )}
                </Stack>
            </Stack>
            <Header title="WikiDash" isTitle />
            <Box sx={{ overflow: "auto" }}>
                <Box
                    sx={{
                        float: "right",
                        mr: 2,
                        mb: 1,
                    }}
                >
                    <PhotoViewer
                        title="WikiDash"
                        image={
                            <img
                                src="/wikipedia_logo.png"
                                alt="Wikipedia"
                                style={{ maxWidth: 100 }}
                            />
                        }
                        infoLines={[
                            {
                                label: "Programmers",
                                info: [
                                    {
                                        label: "Georgia Martinez",
                                        link: "https://atomicobject.com/team/georgia-martinez",
                                    },
                                    {
                                        label: "Maya Malavasi",
                                        link: "https://atomicobject.com/team/maya-malavasi",
                                    },
                                    {
                                        label: "Sydney Cole",
                                        link: "https://atomicobject.com/team/sydney-cole",
                                    },
                                ],
                            },
                            {
                                label: "Platforms",
                                info: ["Web"],
                            },
                            {
                                label: "Release",
                                info: ["TBD"],
                            },
                        ]}
                    />
                </Box>
                <Typography variant="body1">
                    WikiDash is a 2026 browser-based game that generates a new puzzle each day where
                    users are tasked with navigating from one Wikipedia page to another as fast as
                    possible by clicking links within the page. Players are ranked based on how long
                    it took them to complete the puzzle and how many links they clicked.
                </Typography>
            </Box>
            <Header title="Support Wikipedia" />
            <Typography variant="body1">Insert text saying you should donate!</Typography>
            <Header title="Development" />
            <Typography variant="body1">
                WikiDash was developed by Georgia Martinez, Maya Malavasi, and Sydney Cole for the
                2026 Atomic Accelerator hackathon (February 27, 2026 - March 27, 2026). The frontend
                of the project was built using React, Next.js, Vite, and Material UI. The backend of
                the project was built using... The project is dockerized and was deployed using ...
            </Typography>
            <Typography variant="body1"></Typography>
        </Stack>
    );
};
