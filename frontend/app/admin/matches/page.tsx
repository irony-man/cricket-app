import React, { use } from "react";
import MatchList from "@/components/matches/match-list";
import { Suspense } from "react";
import apis from "@/services/apis";
import { Match } from "@/types";
import Link from "next/link";
import Loader from "@/ui/loader";
import Breadcrumb from "@/ui/breadcrumb";

export const metadata = {
    title: "Matches",
};

export default function Page() {
    const matches: Match[] = use(apis.matches.list()) as Match[];

    const breadcrumbLinks = [{ name: "Admin", href: "/admin" }, { name: "Matches", href: "/admin/matches" }];
    return (
        <div className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <Suspense fallback={<Loader />}>
                <MatchList admin matches={matches} heading="Match List" />
            </Suspense>
            <div className="linkCta">
                <Link className="button" href="/admin/matches/add">
                    Add New
                </Link>
            </div>
        </div>
    );
}
