import PlayerForm from "@/components/players/player-form";
import Breadcrumb from "@/ui/breadcrumb";

export default function Page() {
    const breadcrumbLinks = [
        { name: "Admin", href: "/admin" },
        { name: "Players", href: "/admin/players" },
        { name: "Add" },
    ];

    return (
        <main className="container">
            <Breadcrumb links={breadcrumbLinks} />
            <div className="section">
                <PlayerForm />
            </div>
        </main>
    );
}
