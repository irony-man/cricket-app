"use client"
import Button from "@/ui/button";
import React from "react";
import apis from "@/services/apis";
import { Match } from "@/types";

interface MatchStatusProps {
    match: Match;
}


export default function MatchStatus({ match }: MatchStatusProps) {
    const updateMatchStatus = async () => {
        try {
            const newStatus = match.status === "ONGOING" ? "PAUSED" : "ONGOING";
            const formData = { status: newStatus };

            await apis.matches.update({
                id: match.matchId,
                formData,
            }) as Match;

        } catch (error) {
            console.error("Error updating match status:", error);
        }
    };

    return (
        <div className="card" style={{ marginTop: "1rem" }}>
            <Button
                style={{
                    background: match.status === "ONGOING" ? "red" : "green",
                }}
                onClick={updateMatchStatus}
            >
                {match.status === "ONGOING" ? "Pause Match" : "Resume Match"}
            </Button>
        </div>
    );
}
