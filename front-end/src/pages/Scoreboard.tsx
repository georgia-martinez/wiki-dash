import "./Service.css";
import { useQuery } from "convex/react";
import { api } from "../../../back-end/convex/_generated/api";

function Scoreboard() {
  const scores = useQuery(api.scores.get);
  return (
    <div className="Scoreboard">
      {scores?.map(({ _id, username, pagesClicked, timeSpent }) =>
        <div key={_id}>{username}: {pagesClicked} pages clicked, {timeSpent} seconds spent</div>)}
    </div>
  );
}

export default Scoreboard;