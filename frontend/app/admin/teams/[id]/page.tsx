import React, { use } from "react";
import apis from "@/services/apis";
import TeamDetail from "@/components/teams/team-detail";
import { Team } from "@/types";
import Breadcrumb from "@/ui/breadcrumb";

export default function Page({ params }) {
    const { id } = use(params);
    const team: Team = use(apis.teams.get(parseInt(id))) as Team;

    const breadcrumbLinks = [
        { name: "Admin", href: "/admin" },
        { name: "Teams", href: "/admin/teams" },
        { name: team.short_name, href: `/admin/teams/${id}` },
    ];

    return (
        <div className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="mx-auto">
                <TeamDetail admin team={team} />
            </div>
        </div>
    );
}
