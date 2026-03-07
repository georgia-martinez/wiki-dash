import { Box, Button, Dialog, DialogContent, Stack, TextField, Typography } from "@mui/material";
import { SignInButton, useUser } from "@clerk/react";
import { useState } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

interface WinModalProps {
    open: boolean;
    startArticle: string;
    endArticle: string;
    linksClicked: number;
    elapsedSeconds: number;
}

export const WinModal = ({ open, startArticle, endArticle, linksClicked, elapsedSeconds }: WinModalProps) => {
    const [name, setName] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const { isSignedIn, user } = useUser();

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = String(elapsedSeconds % 60).padStart(2, "0");

    const handleSubmit = () => {
        if (name.trim()) {
            setSubmitted(true);
            // TODO: submit to leaderboard
        }
    };

    const handleSignedInSubmit = () => {
        setSubmitted(true);
        // TODO: submit to leaderboard using user.fullName or user.username
    };

    const displayName = user?.fullName ?? user?.username ?? "";

    return (
        <>
            {open && <Confetti numberOfPieces={300} recycle={false} style={{ position: "fixed", zIndex: 9999 }} />}
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
                    sx: { borderRadius: 3, p: 2, backgroundColor: "white" },
                }}
            >
                <DialogContent>
                    <Stack spacing={3} alignItems="center">
                        <Typography variant="h3" fontWeight="bold" textAlign="center">
                            You won!
                        </Typography>
                        <Typography variant="body1" textAlign="center" color="text.secondary">
                            You navigated from{" "}
                            <Box component="span" fontWeight="bold" color="text.primary">
                                {startArticle}
                            </Box>{" "}
                            to{" "}
                            <Box component="span" fontWeight="bold" color="text.primary">
                                {endArticle}
                            </Box>
                        </Typography>

                        <Stack direction="row" gap={4} justifyContent="center">
                            <Stack alignItems="center">
                                <Typography variant="h4" fontWeight="bold">
                                    {linksClicked}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    links clicked
                                </Typography>
                            </Stack>
                            <Stack alignItems="center">
                                <Typography variant="h4" fontWeight="bold">
                                    {minutes}:{seconds}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    time
                                </Typography>
                            </Stack>
                        </Stack>

                        {submitted ? (
                            <Typography variant="body1" color="success.main" fontWeight="bold">
                                Thanks, {isSignedIn ? displayName : name}! You'll be on the leaderboard soon.
                            </Typography>
                        ) : isSignedIn ? (
                            <Stack spacing={1.5} width="100%" alignItems="center">
                                <Typography variant="body1" textAlign="center">
                                    Submitting as <strong>{displayName}</strong>
                                </Typography>
                                <Button variant="outlined" onClick={handleSignedInSubmit} fullWidth>
                                    Add to Leaderboard
                                </Button>
                            </Stack>
                        ) : (
                            <Stack spacing={1.5} width="100%">
                                <Stack direction="row" gap={1} justifyContent="center">
                                    <Typography variant="body1" textAlign="center">
                                        Enter your name for the leaderboard, or
                                    </Typography>
                                    <SignInButton mode="modal">
                                        <Button variant="text" size="small" sx={{ textTransform: "none", p: 0 }}>
                                            sign in
                                        </Button>
                                    </SignInButton>
                                </Stack>
                                <Stack direction="row" gap={1}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Your name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                    />
                                    <Button variant="contained" onClick={handleSubmit} disabled={!name.trim()}>
                                        Submit
                                    </Button>
                                </Stack>
                            </Stack>
                        )}

                        <Button variant="contained" onClick={() => navigate("/leaderboard")} fullWidth>
                            View Leaderboard
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};
