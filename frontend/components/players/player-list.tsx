import React from "react";
import { Player } from "@/types";
import Link from "next/link";

interface PlayerListProps {
    players: Player[];
    heading?: string,
    admin?: boolean;
}

export default function PlayerList({ players, heading= "Player List", admin = false }: PlayerListProps) {
    return (
        <div className="playerList">
            <h2>{heading}</h2>
            {players.length === 0 ? (
                <p>No players found.</p>
            ) : (
                <ul className="list">
                    {players.map((player) => (
                        <Link
                            href={`${admin ? '/admin':''}/players/${player.playerId}`}
                            key={player.playerId}
                        >
                            <li className="listItem">
                                {player.name} ({player.short_name})
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    );
}
