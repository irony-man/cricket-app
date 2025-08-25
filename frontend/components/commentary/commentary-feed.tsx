import { Commentary } from "@/types";

interface CommentaryProps {
    commentary: Commentary[];
}

const CommentaryFeed: React.FC<CommentaryProps> = ({ commentary }) => {
    return commentary.length ? (
        <div className="commentaryContainer card">
            <h2>Commentary</h2>
            <div className="feed">
                {commentary.map((item) => (
                    <div key={item.commentaryId} className="feedItem">
                        <strong>
                            {item.team?.name} {item.over}.{item.ball}:
                        </strong>
                        <span>
                            {item.bowler?.name} to {item.striker?.name}:
                        </span>
                        <strong>{item.eventType}</strong>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <></>
    );
};

export default CommentaryFeed;
