import React, { use } from "react";
import TeamList from "@/components/teams/team-list";
import { Suspense } from "react";
import apis from "@/services/apis";
import { Team } from "@/types";
import Link from "next/link";
import Loader from "@/ui/loader";
import Breadcrumb from "@/ui/breadcrumb";

export const metadata = {
    title: "Teams",
};

export default function Page() {
    const teams: Team[] = use(apis.teams.list()) as Team[];

    const breadcrumbLinks = [{ name: "Admin", href: "/admin" }, { name: "Teams", href: "/admin/teams" }];
    return (
        <div className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <Suspense fallback={<Loader />}>
                <TeamList admin teams={teams} heading="Team List" />
            </Suspense>
            <div className="linkCta">
                <Link className="button" href="/admin/teams/add">
                    Add New
                </Link>
            </div>
        </div>
    );
}
