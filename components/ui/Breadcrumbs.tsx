"use client"

import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { FC } from "react";

export interface ItemData {
    label: string;
    href?: string;
    isCurrent?: boolean;
}

interface Props {
    items: ItemData[];
    className?: string
}

const Breadcrumb: FC<Props> = ({items, className}) => {
    return (
        <Breadcrumbs color="foreground">
            {items.map((item, index) => (
                <BreadcrumbItem
                    key={index}
                    href={item.href}
                    className={`font-medium`}
                    aria-current={item.isCurrent ? "page" : undefined}
                >
                   <span className={className}>{item.label}</span> 
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    )
}

export default Breadcrumb