'use client'

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Match, Commentary } from "@/types";
import MatchInfoCard from "./match-info-card";
import CommentaryFeed from "../commentary/commentary-feed";
import Loader from "@/ui/loader";

interface MatchDetailProps {
  match: Match;
  commentary?: Commentary[];
}

const MatchDetail: React.FC<MatchDetailProps> = ({ match, commentary: commentaryData }) => {
  const [commentary, setCommentary] = useState<Commentary[]>(commentaryData || []);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      query: { matchId: match.matchId },
    });

    socket.on("new-commentary", (newCommentary: Commentary) => {
      console.log(newCommentary);
      
      setCommentary((prevCommentary) => [newCommentary, ...prevCommentary]);
    });

    return () => {
      socket.disconnect();
    };
  }, [match.matchId]);

  if (!match) {
    return <Loader />;
  }

  return (
    <div className="matchContainer">
      <MatchInfoCard match={match} />
      <CommentaryFeed commentary={commentary} />
    </div>
  );
};

export default MatchDetail;