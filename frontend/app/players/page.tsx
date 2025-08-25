import React, { use } from "react";
import PlayerList from "@/components/players/player-list";
import { Suspense } from "react";
import apis from "@/services/apis";
import { Player } from "@/types";
import Link from "next/link";
import Loader from "@/ui/loader";
import Breadcrumb from "@/ui/breadcrumb";

export const metadata = {
    title: "Players",
};

export default function Page() {
    const players: Player[] = use(apis.players.list()) as Player[];

    const breadcrumbLinks = [{ name: "Players", href: "/players" }];
    return (
        <div className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <Suspense fallback={<Loader />}>
                <PlayerList players={players} />
            </Suspense>
        </div>
    );
}
