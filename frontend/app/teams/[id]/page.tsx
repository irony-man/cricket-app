import React, { use } from "react";
import apis from "@/services/apis";
import TeamDetail from "@/components/teams/team-detail";
import { Team } from "@/types";
import Breadcrumb from "@/ui/breadcrumb";

export default function Page({ params }) {
    const { id } = use(params);
    const team: Team = use(apis.teams.get(parseInt(id))) as Team;

    const breadcrumbLinks = [
        { name: "Teams", href: "/teams" },
        { name: team.short_name, href: `/teams/${id}` },
    ];

    return (
        <div className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="mx-auto">
                <TeamDetail team={team} />
            </div>
        </div>
    );
}
