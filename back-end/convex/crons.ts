import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
    "set daily challenge",
    { hourUTC: 0, minuteUTC: 0 },
    internal.challenges.fetchAndSetDailyChallenge
);

export default crons;
