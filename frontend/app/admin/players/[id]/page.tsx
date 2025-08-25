import React, { use } from "react";
import apis from "@/services/apis";
import PlayerDetail from "@/components/players/player-detail";
import { Player } from "@/types";
import Breadcrumb from "@/ui/breadcrumb";

export default function Page({ params }) {
    const { id } = use(params);
    const player: Player = use(apis.players.get(parseInt(id))) as Player;

    const breadcrumbLinks = [
        { name: "Admin", href: "/admin" },
        { name: "Players", href: "/admin/players" },
        { name: player.short_name, href: `/admin/players/${id}` },
    ];

    return (
        <div className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="mx-auto">
                <PlayerDetail admin player={player} />
            </div>
        </div>
    );
}
