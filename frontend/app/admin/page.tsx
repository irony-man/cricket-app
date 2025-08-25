import Link from "next/link";
import Breadcrumb from "@/ui/breadcrumb";

export default function AdminPage() {
    const links = [
        {
            name: "Matches",
            href: "/admin/matches",
        },
        {
            name: "Teams",
            href: "/admin/teams",
        },
        {
            name: "Players",
            href: "/admin/players",
        },
    ];

    const breadcrumbLinks = [{ name: "Admin", href: "/admin" }];

    return (
        <main className="container">
          <Breadcrumb links={breadcrumbLinks} />
            <h1 className="title">Admin Panel</h1>

            {links.map((link) => (
                <div key={link.href} className="card" style={{marginTop: '1rem'}}>
                    <Link href={link.href}>
                        <h2 style={{marginBottom: 0}}>{link.name}</h2>
                    </Link>
                </div>
            ))}
        </main>
    );
}
