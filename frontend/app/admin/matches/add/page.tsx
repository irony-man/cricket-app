import MatchForm from "@/components/matches/match-form";
import Breadcrumb from "@/ui/breadcrumb";

export default function Page() {
    const breadcrumbLinks = [
        { name: "Admin", href: "/admin" },
        { name: "Matches", href: "/admin/matches" },
        { name: "Add" },
    ];

    return (
        <main className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="section">
                <MatchForm />
            </div>
        </main>
    );
}
