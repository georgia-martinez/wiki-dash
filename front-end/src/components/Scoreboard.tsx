import {
    Avatar,
    Box,
    Collapse,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useQuery } from "convex/react";
import { api } from "../../../back-end/convex/_generated/api";
import type { SortBy } from "./SortDropdown";
import { useState } from "react";

const MEDAL_COLORS: Record<number, { bg: string; text: string; label: string }> = {
    0: { bg: "#FFD700", text: "#5a4000", label: "🥇" },
    1: { bg: "#C0C0C0", text: "#3a3a3a", label: "🥈" },
    2: { bg: "#CD7F32", text: "#fff8f0", label: "🥉" },
};

function RankCell({ rank }: { rank: number }) {
    const medal = MEDAL_COLORS[rank];
    if (medal) {
        return (
            <TableCell align="center">
                <Avatar
                    sx={{
                        bgcolor: medal.bg,
                        color: medal.text,
                        width: 32,
                        height: 32,
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        mx: "auto",
                    }}
                >
                    {rank + 1}
                </Avatar>
            </TableCell>
        );
    }
    return (
        <TableCell align="center">
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {rank + 1}
            </Typography>
        </TableCell>
    );
}

function PathTag({ label, highlighted, isEnd }: { label: string; highlighted?: boolean; isEnd?: boolean }) {
    const borderColor = highlighted ? "#3366cc" : isEnd ? "#2e7d32" : "divider";
    const bgcolor = highlighted ? "#e8f0fe" : isEnd ? "#edf7ed" : "transparent";
    const color = highlighted ? "#3366cc" : isEnd ? "#2e7d32" : "text.primary";
    return (
        <Box
            sx={{
                border: "1.5px solid",
                borderColor,
                borderRadius: 99,
                px: 1.5,
                py: 0.5,
                fontSize: "0.8rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
                bgcolor,
                color,
                flexShrink: 0,
            }}
        >
            {label}
        </Box>
    );
}

function PathRow({ path, colSpan }: { path: string[]; colSpan: number }) {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} sx={{ py: 0, border: 0, bgcolor: "#fafafa", maxWidth: 0, overflow: "hidden" }}>
                <Collapse in timeout="auto" unmountOnExit>
                    <Box
                        sx={{
                            overflowX: "auto",
                            px: 2,
                            py: 1.5,
                            "&::-webkit-scrollbar": { height: 4 },
                            "&::-webkit-scrollbar-thumb": { bgcolor: "#ddd", borderRadius: 2 },
                        }}
                    >
                        <Stack direction="row" alignItems="center" gap={1} sx={{ width: "max-content" }}>
                            {path.map((article, i) => (
                                <Stack key={i} direction="row" alignItems="center" gap={1} sx={{ flexShrink: 0 }}>
                                    <PathTag label={article} highlighted={i === 0} isEnd={i === path.length - 1 && path.length > 1} />
                                    {i < path.length - 1 && (
                                        <Typography color="text.secondary" fontSize="0.85rem">→</Typography>
                                    )}
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );
}

function Scoreboard({ sortBy, selectedDate }: { sortBy: SortBy; selectedDate?: string }) {
    const scores = useQuery(api.scores.get);
    const challenge = useQuery(api.challenges.getChallengeByDate, selectedDate ? { date: selectedDate } : "skip");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    const filtered = (scores ?? []).filter((s) => (selectedDate ? s.date === selectedDate : true));

    const sorted = [...filtered].sort((a, b) =>
        sortBy === "time" ? a.timeSpent - b.timeSpent : a.pagesClicked - b.pagesClicked
    );

    return (
        <Box sx={{ width: "100%", maxWidth: 640, mx: "auto", mt: 3 }}>
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: "1px solid #e0e0e0", borderRadius: 2, maxHeight: "60vh", overflowY: "auto" }}
            >
                <Table>
                    <TableHead sx={{ position: "sticky", top: 0, zIndex: 1 }}>
                        <TableRow sx={{ bgcolor: "#fafafa" }}>
                            <TableCell
                                align="center"
                                sx={{
                                    fontWeight: 700,
                                    width: 60,
                                    color: "text.secondary",
                                    fontSize: "0.75rem",
                                    letterSpacing: 1,
                                    textTransform: "uppercase",
                                }}
                            >
                                Rank
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 700,
                                    color: "text.secondary",
                                    fontSize: "0.75rem",
                                    letterSpacing: 1,
                                    textTransform: "uppercase",
                                }}
                            >
                                Player
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: 700,
                                    color: "text.secondary",
                                    fontSize: "0.75rem",
                                    letterSpacing: 1,
                                    textTransform: "uppercase",
                                }}
                            >
                                Clicks
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{
                                    fontWeight: 700,
                                    color: "text.secondary",
                                    fontSize: "0.75rem",
                                    letterSpacing: 1,
                                    textTransform: "uppercase",
                                }}
                            >
                                Time
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sorted.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        {scores === undefined ? "Loading..." : "No scores yet"}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            sorted.map(({ _id, username, pagesClicked, timeSpent, path }, index) => {
                                const isTopThree = index < 3;
                                const isExpanded = expandedIds.has(_id);
                                const hasPath = path && path.length > 0;
                                return (
                                    <>
                                        <TableRow
                                            key={_id}
                                            onClick={() => {
                                                if (!hasPath) return;
                                                setExpandedIds(prev => {
                                                    const next = new Set(prev);
                                                    if (isExpanded) next.delete(_id); else next.add(_id);
                                                    return next;
                                                });
                                            }}
                                            sx={{
                                                bgcolor: isTopThree
                                                    ? `${Object.values(MEDAL_COLORS)[index].bg}18`
                                                    : "white",
                                                "&:last-child td": { border: 0 },
                                                "& td": isExpanded ? { borderBottom: 0 } : {},
                                                cursor: hasPath ? "pointer" : "default",
                                                "&:hover": hasPath ? { bgcolor: isTopThree ? `${Object.values(MEDAL_COLORS)[index].bg}28` : "#f5f5f5" } : {},
                                            }}
                                        >
                                            <RankCell rank={index} />
                                            <TableCell>
                                                <Typography fontWeight={isTopThree ? 700 : 400}>
                                                    {username}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography>{pagesClicked}</Typography>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography color="text.secondary">
                                                    {`${Math.floor(timeSpent / 60)}:${String(timeSpent % 60).padStart(2, "0")}`}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        {isExpanded && hasPath && (
                                            <PathRow key={`${_id}-path`} path={challenge?.article1 ? [challenge.article1, ...path] : path} colSpan={4} />
                                        )}
                                    </>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Scoreboard;
