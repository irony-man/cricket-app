import TeamForm from "@/components/teams/team-form";
import apis from "@/services/apis";
import { Team } from "@/types";
import Breadcrumb from "@/ui/breadcrumb";
import { use } from "react";

export default function Page({ params }) {
    const { id } = use(params);
    const team: Team = use(apis.teams.get(parseInt(id))) as Team;

    const breadcrumbLinks = [
        { name: "Admin", href: "/admin" },
        { name: "Teams", href: "/admin/teams" },
        { name: team.short_name, href: `/admin/teams/${id}` },
        { name: "Edit", },
    ];

    return (
        <main className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="section">
                <TeamForm heading="Edit Team" team={team} />
            </div>
        </main>
    );
}
