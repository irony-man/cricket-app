import React, { use } from "react";
import apis from "@/services/apis";
import MatchDetail from "@/components/matches/match-detail";
import { MatchDetail as MatchDetailInterface } from "@/types";
import Breadcrumb from "@/ui/breadcrumb";
import CommentaryForm from "@/components/commentary/commentary-form";

export default function Page({ params }) {
    const { id } = use(params);
    const match: MatchDetailInterface = use(
        apis.matches.get(parseInt(id))
    ) as MatchDetailInterface;

    const breadcrumbLinks = [
        { name: "Admin", href: "/admin" },
        { name: "Matches", href: "/admin/matches" },
        { name: id, href: `/admin/matches/${id}` },
    ];

    return (
        <div className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="mx-auto">
                <MatchDetail {...match} />
                <div style={{marginTop: '1rem'}}>
                    <CommentaryForm match={match.match} />
                </div>
            </div>
        </div>
    );
}
