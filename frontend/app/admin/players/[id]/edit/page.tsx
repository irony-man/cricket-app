import PlayerForm from "@/components/players/player-form";
import apis from "@/services/apis";
import { Player } from "@/types";
import Breadcrumb from "@/ui/breadcrumb";
import { use } from "react";

export default function Page({ params }) {
    const { id } = use(params);
    const player: Player = use(apis.players.get(parseInt(id))) as Player;

    const breadcrumbLinks = [
        { name: "Admin", href: "/admin" },
        { name: "Players", href: "/admin/players" },
        { name: player.short_name, href: `/admin/players/${id}` },
        { name: "Edit", },
    ];

    return (
        <main className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="section">
                <PlayerForm heading="Edit Player" player={player} />
            </div>
        </main>
    );
}
