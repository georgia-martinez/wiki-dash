import { SignInButton, UserButton, useUser } from "@clerk/react";
import { Box, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ExternalLink } from "../components/ExternalLink";
import { Header } from "../components/Header";
import { PhotoViewer } from "../components/PhotoViewer";

export const HomePage = () => {
    const { isSignedIn } = useUser();

    return (
        <Stack sx={{ px: 30, gap: 2, justifyContent: "center" }}>
            <Stack direction="row" marginLeft="auto" alignItems="center">
                <Stack direction="row" gap={2} alignItems="center">
                    <ExternalLink href="https://donate.wikimedia.org/w/index.php?title=Special:LandingPage&country=US&uselang=en&wmf_medium=sidebar&wmf_source=donate&wmf_campaign=en.wikipedia.org">
                        Donate to Wikipedia
                    </ExternalLink>
                    {isSignedIn ? (
                        <UserButton />
                    ) : (
                        <SignInButton mode="modal">
                            <Typography
                                variant="body1"
                                sx={{ cursor: "pointer", color: "#3366cc" }}
                            >
                                Sign In
                            </Typography>
                        </SignInButton>
                    )}
                </Stack>
            </Stack>
            <Header title="WikiDash" isTitle />
            <Box>
                <Box
                    sx={{
                        float: "right",
                        ml: 3,
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
                                info: ["March 27, 2026"],
                            },
                            {
                                label: "Repository",
                                info: [
                                    {
                                        label: "github.com/georgia-martinez/wiki-dash",
                                        link: "https://github.com/georgia-martinez/wiki-dash",
                                    },
                                ],
                            },
                        ]}
                    />
                </Box>
                <Stack gap={1}>
                    <Typography variant="body1">
                        WikiDash is a 2026{" "}
                        <ExternalLink href="https://en.wikipedia.org/wiki/Browser_game">
                            browser game
                        </ExternalLink>{" "}
                        that generates a new puzzle each day where users are tasked with navigating
                        from one{" "}
                        <ExternalLink href="https://en.wikipedia.org/wiki/Wikipedia">
                            Wikipedia
                        </ExternalLink>{" "}
                        page to another as fast as possible by clicking links within the page.
                        Players are ranked based on how long it took them to complete the puzzle and
                        how many links they clicked. New challenges are available every day at
                        midnight{" "}
                        <ExternalLink href="https://en.wikipedia.org/wiki/Coordinated_Universal_Time">
                            UTC
                        </ExternalLink>
                        .
                    </Typography>
                </Stack>
                <Box
                    mt={2}
                    sx={{
                        border: "1px solid",
                        borderColor: "grey.300",
                        bgcolor: "#eaf0fb",
                        p: 2,
                        width: "fit-content",
                    }}
                >
                    <Typography
                        variant="overline"
                        fontWeight={700}
                        sx={{ display: "block", mb: 1, color: "text.primary", lineHeight: 1 }}
                    >
                        Start Playing
                    </Typography>
                    <Stack gap={1}>
                        {[
                            { to: "/game", label: "Start today's WikiDash", primary: true },
                            {
                                to: "/game?mode=random",
                                label: "Play a random unranked game",
                                onClick: () =>
                                    sessionStorage.setItem("wikiDash_randomFresh", "true"),
                            },
                            { to: "/leaderboard", label: "View the leaderboard" },
                        ].map(({ to, label, onClick, primary }) => (
                            <Link
                                key={to}
                                to={to}
                                onClick={onClick}
                                style={{ textDecoration: "none" }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "1px solid",
                                        borderColor: primary ? "#3366cc" : "grey.300",
                                        px: 3,
                                        py: 1,
                                        bgcolor: primary ? "#3366cc" : "white",
                                        color: primary ? "white" : "#3366cc",
                                        typography: "body1",
                                        width: 320,
                                        "&:hover": { bgcolor: primary ? "#2a55aa" : "#f0f4ff" },
                                        transition: "background-color 0.15s",
                                    }}
                                >
                                    {label}
                                </Box>
                            </Link>
                        ))}
                    </Stack>
                </Box>
            </Box>
            <Header title="Development" />
            <Typography variant="body1">
                WikiDash was developed by Georgia Martinez, Maya Malavasi, and Sydney Cole for the
                2026{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Atomic_Object">
                    Atomic Object
                </ExternalLink>{" "}
                Accelerator{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Hackathon">
                    hackathon
                </ExternalLink>{" "}
                (February 27, 2026 – March 27, 2026).
            </Typography>
            <Typography variant="body1">
                The frontend was built with{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/React_(software)">
                    React
                </ExternalLink>{" "}
                and{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Vite_(software)">
                    Vite
                </ExternalLink>
                , using{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Material_Design">
                    Material UI
                </ExternalLink>{" "}
                for components and{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Clerk_(company)">
                    Clerk
                </ExternalLink>{" "}
                for authentication. The backend is powered by Convex, a backend-as-a-service
                platform that handles the database, real-time queries, and a scheduled{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Cron">cron job</ExternalLink> that
                generates a new puzzle every day at midnight{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Coordinated_Universal_Time">
                    UTC
                </ExternalLink>
                .
            </Typography>
            <Typography variant="body1">
                Daily puzzles are generated by fetching the previous day's most-viewed Wikipedia
                articles from the{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Wikimedia_Foundation">
                    Wikimedia
                </ExternalLink>{" "}
                pageviews API, filtering out special pages and inappropriate content, and randomly
                selecting two articles as the start and end points. Wikipedia article content is
                fetched live during gameplay via the{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/MediaWiki">
                    MediaWiki
                </ExternalLink>{" "}
                API.
            </Typography>
            <Typography variant="body1">
                The project is{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Docker_(software)">
                    containerized with Docker
                </ExternalLink>{" "}
                and deployed on Fly.io, with the frontend served as a static site via{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Nginx">Nginx</ExternalLink> and
                the Convex backend running as a separate service with persistent storage.
            </Typography>
            <Header title="Support Wikipedia" />
            <Typography variant="body1">
                This project wouldn't be possible without{" "}
                <ExternalLink href="https://en.wikipedia.org/wiki/Wikipedia">
                    Wikipedia
                </ExternalLink>
                . Wikipedia is a free, nonprofit encyclopedia that anyone can edit. It is one of the
                most visited websites in the world and is used by millions of people every day. If
                you enjoy playing WikiDash, please consider{" "}
                <ExternalLink href="https://donate.wikimedia.org/w/index.php?title=Special:LandingPage&country=US&uselang=en&wmf_medium=sidebar&wmf_source=donate&wmf_campaign=en.wikipedia.org">
                    donating to the Wikimedia Foundation
                </ExternalLink>{" "}
                to help keep Wikipedia free and accessible for everyone.
            </Typography>
        </Stack>
    );
};
