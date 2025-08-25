import { Player } from "@/types";
import Link from "next/link";
import React from "react";
import TeamList from "../teams/team-list";

interface PlayerDetailProps {
    player: Player;
    admin?: boolean;
}

export default function PlayerDetail({
    player,
    admin = false,
}: PlayerDetailProps) {
    return (
        <div className="card">
            <p>Name: {player.name}</p>
            <p>Short Name: {player.short_name}</p>
            <p>Role: {player.role}</p>
            <TeamList admin={admin} teams={player.teams} />
            {admin ? (
                <div className="linkCta">
                    <Link
                        className="button"
                        href={`/admin/players/${player.playerId}/edit`}
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
