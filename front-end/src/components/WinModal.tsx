import { SignInButton, useUser } from "@clerk/react";
import { Box, Button, Dialog, DialogContent, Stack, TextField, Typography } from "@mui/material";
import { useMutation } from "convex/react";
import { useState } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { api } from "../../../back-end/convex/_generated/api";
import { ArticleTag } from "./ArticleTag";

interface WinModalProps {
    open: boolean;
    startArticle: string;
    endArticle: string;
    linksClicked: number;
    elapsedSeconds: number;
    isRandom?: boolean;
    path?: string[];
}

export const WinModal = ({
    open,
    startArticle,
    endArticle,
    linksClicked,
    elapsedSeconds,
    isRandom,
    path,
}: WinModalProps) => {
    const [name, setName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const { isSignedIn, user } = useUser();
    const submitScore = useMutation(api.scores.submit);

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = String(elapsedSeconds % 60).padStart(2, "0");

    const handleSubmit = (username: string) => {
        submitScore({
            username,
            pagesClicked: linksClicked,
            timeSpent: elapsedSeconds,
            date: new Date().toISOString().split("T")[0],
            path,
        });
        setSubmitted(true);
    };

    const displayName = user?.fullName ?? user?.username ?? "";

    return (
        <>
            {open && (
                <Confetti
                    numberOfPieces={300}
                    recycle={false}
                    style={{ position: "fixed", zIndex: 9999 }}
                />
            )}
            <Dialog
                open={open}
                maxWidth="sm"
                fullWidth
                slotProps={{
                    backdrop: {
                        sx: { backdropFilter: "blur(6px)" },
                    },
                }}
                PaperProps={{
                    sx: { borderRadius: 4, p: 2, backgroundColor: "white" },
                }}
            >
                <DialogContent>
                    <Stack spacing={3} alignItems="center">
                        <Typography fontSize={48} lineHeight={1}>
                            🏆
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" textAlign="center">
                            You won!
                        </Typography>

                        <Stack direction="row" alignItems="center" gap={1.5}>
                            <ArticleTag label={startArticle} />
                            <Typography color="text.secondary">→</Typography>
                            <ArticleTag label={endArticle} />
                        </Stack>

                        <Stack direction="row" gap={2} width="100%">
                            <Box
                                sx={{
                                    flex: 1,
                                    bgcolor: "#f5f5f5",
                                    borderRadius: 3,
                                    p: 2.5,
                                    textAlign: "center",
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" mb={0.5}>
                                    Links clicked
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {linksClicked}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    flex: 1,
                                    bgcolor: "#f5f5f5",
                                    borderRadius: 3,
                                    p: 2.5,
                                    textAlign: "center",
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" mb={0.5}>
                                    Time
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {minutes}:{seconds}
                                </Typography>
                            </Box>
                        </Stack>
                        {!isRandom &&
                            (submitted ? (
                                <Typography
                                    variant="body1"
                                    color="success.main"
                                    fontWeight="bold"
                                    textAlign="center"
                                >
                                    Thanks for playing {isSignedIn ? displayName : name}!
                                </Typography>
                            ) : isSignedIn ? (
                                <Stack spacing={1.5} width="100%" alignItems="center">
                                    <Typography variant="body1" textAlign="center">
                                        Submitting as <strong>{displayName}</strong>
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleSubmit(displayName)}
                                        fullWidth
                                    >
                                        Add to leaderboard
                                    </Button>
                                </Stack>
                            ) : (
                                <Stack spacing={1.5} width="100%">
                                    <Stack direction="row" gap={0.5} justifyContent="center">
                                        <Typography variant="body1" textAlign="center">
                                            Enter your name for the leaderboard, or
                                        </Typography>
                                        <SignInButton mode="modal">
                                            <Typography
                                                variant="body1"
                                                sx={{ cursor: "pointer", color: "#3366cc" }}
                                            >
                                                sign in
                                            </Typography>
                                        </SignInButton>
                                    </Stack>
                                    <Stack direction="row" gap={1}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            onKeyDown={(e) =>
                                                e.key === "Enter" && handleSubmit(name.trim())
                                            }
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => handleSubmit(name.trim())}
                                            disabled={!name.trim()}
                                        >
                                            Submit
                                        </Button>
                                    </Stack>
                                </Stack>
                            ))}
                        {!isRandom && (
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/leaderboard", { replace: true })}
                                fullWidth
                            >
                                View leaderboard
                            </Button>
                        )}
                        <Button variant="outlined" onClick={() => navigate("/", { replace: true })} fullWidth>
                            Back to home
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};
