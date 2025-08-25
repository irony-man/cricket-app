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

    const breadcrumbLinks = [{ name: "Admin", href: "/admin" }, { name: "Players", href: "/admin/players" }];
    return (
        <div className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <Suspense fallback={<Loader />}>
                <PlayerList admin players={players} />
            </Suspense>
            <div className="linkCta">
                <Link className="button" href="/admin/players/add">
                    Add New
                </Link>
            </div>
        </div>
    );
}
