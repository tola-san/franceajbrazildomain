import { Skeleton } from "@heroui/react";

const SearchHorizontalLoader = () => {
    return (
        <div className="flex items-center gap-5">
            <Skeleton className="relative h-20 w-20 overflow-hidden rounded-xl">
                <div className="h-20 w-20 rounded-lg bg-secondary" />
            </Skeleton>
            <div className="flex flex-col gap-1 w-full space-y-2">
                <Skeleton className="relative h-3 w-1/2 overflow-hidden rounded-xl">
                    <div className="h-20 w-full rounded-lg bg-secondary" />
                </Skeleton>
                <Skeleton className="w-1/3 rounded-lg" >
                    <div className="h-3 w-full rounded-lg bg-secondary-300" />
                </Skeleton>
            </div>
        </div>

    )
}

export default SearchHorizontalLoader;