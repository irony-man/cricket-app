import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { Commentary, Match } from "@/types";

type NewCommentaryHandler = (commentary: Commentary) => void;
type UpdateMatchHandler = (match: Match) => void;

export const useMatchSocket = (
    matchId: number,
    onNewCommentary: NewCommentaryHandler,
    onUpdateMatch: UpdateMatchHandler
) => {
    useEffect(() => {
        if (!matchId) return;

        socket.io.opts.query = { matchId };
        socket.connect();

        socket.on("new-commentary", onNewCommentary);
        socket.on("update-match", onUpdateMatch);

        return () => {
            socket.off("new-commentary", onNewCommentary);
            socket.off("update-match", onUpdateMatch);
            socket.disconnect();
        };
    }, [matchId, onNewCommentary, onUpdateMatch]);
};
