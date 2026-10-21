import { Skeleton } from "@heroui/react";

const CategoryLoader = () => {
    return (
        <div className="w-full">
            {/* Header Skeleton */}
            <div className="flex flex-col items-center justify-center gap-5 mt-32 mb-20 animate-pulse">
                <Skeleton className="w-1/3 h-10 lg:h-16 rounded-lg bg-default-300" />
                <Skeleton className="w-2/3 lg:w-1/2 h-6 rounded-lg bg-default-200" />
            </div>

            {/* Carousel Skeleton */}
            <div className="px-6">
                <div className="flex items-center justify-center gap-6 overflow-hidden">
                    {/* Fake Arrows */}
                    <Skeleton className="w-12 h-12 rounded-full flex-shrink-0 hidden lg:block bg-default-300" />

                    {/* Cards */}
                    <div className="flex gap-6 w-full overflow-hidden">
                        {[1, 2, 3, 4].map((item) => (
                            <Skeleton key={item} className="w-full min-w-[280px] h-[520px] rounded-[30px] lg:rounded-[40px] bg-default-200">
                                <div className="h-full w-full bg-default-100/50" />
                            </Skeleton>
                        ))}
                    </div>

                    <Skeleton className="w-12 h-12 rounded-full flex-shrink-0 hidden lg:block bg-default-300" />
                </div>
            </div>
        </div>
    );
};

export default CategoryLoader;
