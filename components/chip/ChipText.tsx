"use client"

import { Chip } from "@heroui/react"
import { FC } from "react"

interface Props {
    text: string
    className?: string
}


const ChipText: FC<Props> = ({text, className}) => {
    return (
        <Chip color="primary" size="lg" variant="flat" className={className}>
            {text}
        </Chip>
    )
}

export default ChipText