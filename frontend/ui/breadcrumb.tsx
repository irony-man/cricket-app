import Link from "next/link";
import React from "react";

interface BreadcrumbLink {
    name: string;
    href?: string;
}

interface BreadcrumbProps {
    links: BreadcrumbLink[];
}

export default function Breadcrumb({ links }: BreadcrumbProps) {
    return (
        <ul className="breadcrumb">
            <li>
                <Link href="/">
                    Home
                </Link>
            </li>

            {links.map((link, idx) => {
                const isLast = idx === links.length - 1;
                return (
                    <li key={link.name}>
                        {(isLast || !link.href) ? (
                            <span>{link.name}</span>
                        ) : (
                            <Link href={link.href}>{link.name}</Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
