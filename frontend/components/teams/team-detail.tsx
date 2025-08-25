import { Team } from "@/types";
import Link from "next/link";
import React from "react";
import PlayerList from "../players/player-list";

interface TeamDetailProps {
    team: Team;
    admin?: boolean;
}

export default function TeamDetail({ team, admin = false }: TeamDetailProps) {
    return (
        <div className="card">
            <p>Name: {team.name}</p>
            <p>Short Name: {team.short_name}</p>

            <PlayerList admin={admin} players={team.players || []} />

            {admin ? (
                <div className="linkCta">
                    <Link
                        className="button"
                        href={`/admin/teams/${team.teamId}/edit`}
                    >
                        Edit
                    </Link>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
