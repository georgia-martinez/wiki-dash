import { useQuery } from "convex/react";
import { api } from "../../../back-end/convex/_generated/api";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import type { SortBy } from "./SortDropdown";

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

function Scoreboard({ sortBy }: { sortBy: SortBy }) {
  const scores = useQuery(api.scores.get);

  const sorted = [...(scores ?? [])].sort((a, b) =>
    sortBy === "time" ? a.timeSpent - b.timeSpent : a.pagesClicked - b.pagesClicked
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 640, mx: "auto", mt: 3 }}>
      <Box sx={{ borderBottom: "2px solid #D4AF37", mb: 3 }} />
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              <TableCell align="center" sx={{ fontWeight: 700, width: 60, color: "text.secondary", fontSize: "0.75rem", letterSpacing: 1, textTransform: "uppercase" }}>
                Rank
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.75rem", letterSpacing: 1, textTransform: "uppercase" }}>
                Player
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.75rem", letterSpacing: 1, textTransform: "uppercase" }}>
                Pages
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "text.secondary", fontSize: "0.75rem", letterSpacing: 1, textTransform: "uppercase" }}>
                Time (s)
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorted.map(({ _id, username, pagesClicked, timeSpent }, index) => {
              const isTopThree = index < 3;
              return (
                <TableRow
                  key={_id}
                  sx={{
                    bgcolor: isTopThree ? `${Object.values(MEDAL_COLORS)[index].bg}18` : "white",
                    "&:last-child td": { border: 0 },
                    transition: "background-color 0.15s",
                    "&:hover": { bgcolor: "#f5f5f5" },
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
                    <Typography color="text.secondary">{timeSpent}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Scoreboard;