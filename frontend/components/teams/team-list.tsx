import React from "react";
import { Team } from "@/types";
import Link from "next/link";

interface TeamListProps {
    teams: Team[];
    heading?: string,
    admin: boolean;
}

export default function TeamList({ teams, heading, admin }: TeamListProps) {
    return (
        <div className="teamList">
            {heading && <h2>{heading}</h2>}
            {teams.length === 0 ? (
                <p>No teams found.</p>
            ) : (
                <ul className="list">
                    {teams.map((team) => (
                        <Link
                            href={`${admin ? '/admin':''}/teams/${team.teamId}`}
                            key={team.teamId}
                        >
                            <li className="listItem">
                                {team.name} ({team.short_name})
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}
