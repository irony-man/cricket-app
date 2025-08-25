import TeamForm from "@/components/teams/team-form";
import Breadcrumb from "@/ui/breadcrumb";

export default function Page() {
    const breadcrumbLinks = [
        { name: "Admin", href: "/admin" },
        { name: "Teams", href: "/admin/teams" },
        { name: "Add" },
    ];

    return (
        <main className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="section">
                <TeamForm />
            </div>
        </main>
    );
}
