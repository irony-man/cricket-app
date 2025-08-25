import React, { use } from "react";
import apis from "@/services/apis";
import MatchDetail from "@/components/matches/match-detail";
import { Match } from "@/types";
import Breadcrumb from "@/ui/breadcrumb";

export default function Page({ params }) {
    const { id } = use(params);
    const match: Match = use(apis.matches.get(parseInt(id))) as Match;

    const breadcrumbLinks = [
        { name: id, href: `/matches/${id}` },
    ];

    return (
        <div className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="mx-auto">
                <MatchDetail {...match} />
            </div>
        </div>
    );
}
