import React from "react";
import { Match } from "@/types";
import Link from "next/link";
import MatchInfoCard from "./match-info-card";

interface MatchListProps {
    matches: Match[];
    heading?: string;
    admin?: boolean;
}

export default function MatchList({ matches, heading, admin = false }: MatchListProps) {
    return (
        <div className="matchList">
            {heading && <h2>{heading}</h2>}
            {matches.length === 0 ? (
                <p>No matches found.</p>
            ) : (
                <ul className="list">
                    {matches.map((match) => (
                        <Link
                            href={`${admin ? "/admin" : ""}/matches/${match.matchId}`}
                            key={match.matchId}
                        >
                            <MatchInfoCard match={match} />
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}
