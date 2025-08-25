"use client";

import { useState, useCallback } from "react";
import { Match, Commentary } from "@/types";
import { useMatchSocket } from "@/hooks/useMatchSocket";
import MatchInfoCard from "./match-info-card";
import CommentaryFeed from "../commentary/commentary-feed";
import MatchStatus from "./match-status";

interface MatchDetailProps {
    match: Match;
    commentary?: Commentary[];
    status?: boolean;
}

const MatchDetail: React.FC<MatchDetailProps> = ({
    match: matchData,
    commentary: commentaryData,
    status = false,
}) => {
    const [match, setMatch] = useState<Match>(matchData);
    const [commentary, setCommentary] = useState<Commentary[]>(
        commentaryData || []
    );

    const handleNewCommentary = useCallback((newCommentary: Commentary) => {
        setCommentary((prev) => [newCommentary, ...prev]);
    }, []);

    const handleUpdateMatch = useCallback((updatedMatch: Match) => {
        setMatch(updatedMatch);
    }, []);

    useMatchSocket(match.matchId, handleNewCommentary, handleUpdateMatch);

    return (
        <div className="matchContainer">
            <MatchInfoCard match={match} />
            <CommentaryFeed commentary={commentary} />
            {status && <MatchStatus match={match} />}
        </div>
    );
};

export default MatchDetail;
