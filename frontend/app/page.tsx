import React, { use } from "react";
import MatchList from "@/components/matches/match-list";
import { Suspense } from "react";
import apis from "@/services/apis";
import { Match } from "@/types";
import Link from "next/link";
import Loader from "@/ui/loader";

export default function Home() {
    const matches: Match[] = use(apis.matches.list()) as Match[];
    return (
        <main className="container">
            <h1 className="title">Live Cricket Commentary</h1>
            <Suspense fallback={<Loader />}>
                <MatchList matches={matches} heading="Match List" />
            </Suspense>
            <div className="linkCta">
                <Link className="button" href="/admin" target="_blank">
                    Admin
                </Link>
            </div>
        </main>
    );
}
