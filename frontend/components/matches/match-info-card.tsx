import { Match } from "../../types";

interface ScoreboardProps {
  match: Match;
}

const MatchInfoCard: React.FC<ScoreboardProps> = ({ match }) => {
  return (
    <div className="matchInfoCard card">
      <h2 className="matchTitle">
        {match.teams[0].name} vs {match.teams[1].name}
      </h2>
      <div>Status: <strong>{match.status}</strong></div>
      {match.toss && (
        <div>
          Toss won by {match.toss.winner.name} and chose to {match.toss.decision}
        </div>
      )}
    </div>
  );
};

export default MatchInfoCard;