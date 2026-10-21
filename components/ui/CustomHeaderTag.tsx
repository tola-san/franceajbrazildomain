import React, { ElementType } from 'react';

interface CustomHeaderTagProps {
    as?: ElementType;
    className?: string;
    children: React.ReactNode;
}

const CustomHeaderTag: React.FC<CustomHeaderTagProps> = ({
    as: Tag = 'h2',
    className = "",
    children
}) => {
    return (
        <Tag className={className}>
            {children}
        </Tag>
    );
};

export default CustomHeaderTag;
