'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoDotFill } from 'react-icons/go';
import React, { ReactNode } from 'react';

interface ActiveLinkProps {
    href: string;
    children: ReactNode;
    className?: string;
    dot?: boolean;
    onClick?: () => void;
}

export default function ActiveLink({
    href,
    children,
    className = '',
    dot = true,
    onClick,
}: ActiveLinkProps) {
    const pathname = usePathname();
    const currentPath = pathname.split('/').slice(2).join('/');
    const targetPath = href.replace(/^\//, '');
    const isActive = currentPath === targetPath;

    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center gap-2 transition-colors duration-300 ${className}`}
        >
            {isActive && dot && <GoDotFill className="text-primary mt-1" />}
            {children}
        </Link>
    );
}
