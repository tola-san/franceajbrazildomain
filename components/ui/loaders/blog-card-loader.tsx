'use client'

import { Skeleton } from "@heroui/react";

const BlogCardLoader = () => {
    return (
        <div className="relative min-h-[500px] overflow-hidden rounded-[50px] bg-white p-4">
            {/* Cover image */}
            <Skeleton className="relative rounded-[40px] overflow-hidden w-full h-[250px] 2xl:h-[300px] 3xl:h-[350px]">
                <div className="h-full w-full rounded-[40px] bg-secondary" />
            </Skeleton>

            <div className="px-5">
                {/* Title */}
                <div className="space-y-2 mt-5">
                    <Skeleton className="w-5/6 rounded-lg">
                        <div className="h-4 w-full rounded-lg bg-secondary" />
                    </Skeleton>
                    <Skeleton className="w-3/5 rounded-lg">
                        <div className="h-4 w-full rounded-lg bg-secondary" />
                    </Skeleton>
                </div>

                {/* Author / date meta */}
                <div className="flex items-center gap-4 mt-4">
                    <Skeleton className="w-[90px] rounded-lg">
                        <div className="h-3 w-full rounded-lg bg-secondary-300" />
                    </Skeleton>
                    <Skeleton className="w-[120px] rounded-lg">
                        <div className="h-3 w-full rounded-lg bg-secondary-300" />
                    </Skeleton>
                </div>

                {/* Excerpt */}
                <div className="space-y-2 mt-5">
                    <Skeleton className="w-full rounded-lg">
                        <div className="h-3 w-full rounded-lg bg-secondary-200" />
                    </Skeleton>
                    <Skeleton className="w-full rounded-lg">
                        <div className="h-3 w-full rounded-lg bg-secondary-200" />
                    </Skeleton>
                    <Skeleton className="w-4/5 rounded-lg">
                        <div className="h-3 w-full rounded-lg bg-secondary-200" />
                    </Skeleton>
                </div>

                {/* Read more button */}
                <Skeleton className="w-[130px] h-[48px] rounded-xl mt-10 mb-5">
                    <div className="h-full w-full bg-secondary-300" />
                </Skeleton>
            </div>
        </div>
    )
}

export default BlogCardLoader;
