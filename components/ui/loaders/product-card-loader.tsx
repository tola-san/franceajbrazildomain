'use client'

import { Skeleton } from "@heroui/react";
import { useState } from "react";


const ProductCardLoader = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    return (
        <div className="relative !w-full lg:min-h-[300px] lg:min-w-[400px] overflow-hidden rounded-[28px] sm:rounded-[30px] lg:rounded-[50px] bg-white p-1 lg:p-4">
            <Skeleton className="relative rounded-[20px] lg:rounded-[40px] overflow-hidden w-full h-[150px] sm:h-[200px] lg:h-[280px] 3xl:h-[28vh]" isLoaded={isLoaded}>
                <div className="h-24 rounded-lg bg-secondary" />
            </Skeleton>
            <div className="px-1">
                <Skeleton className="w-1/3 rounded-lg mt-5" isLoaded={isLoaded}>
                    <div className="h-3 w-full rounded-lg bg-secondary-200" />
                </Skeleton>
                <div className="space-y-2 mt-8  hidden sm:block">
                    <Skeleton className="w-3/6 rounded-lg" isLoaded={isLoaded}>
                        <div className="h-3 w-full rounded-lg bg-secondary" />
                    </Skeleton>
                    <Skeleton className="w-2/2 rounded-lg" isLoaded={isLoaded}>
                        <div className="h-3 w-full rounded-lg bg-secondary-300" />
                    </Skeleton>
                </div>
                <div className="flex items-center justify-between mt-3 sm:mt-12 mb-2">
                    <div className="space-y-2">
                        <Skeleton className="w-[80px] rounded-lg" isLoaded={isLoaded}>
                            <div className="h-3 w-full rounded-lg bg-secondary" />
                        </Skeleton>
                        <Skeleton className="w-[100px] rounded-lg" isLoaded={isLoaded}>
                            <div className="h-3 w-full rounded-lg bg-secondary-300" />
                        </Skeleton>
                    </div>
                    <Skeleton className="w-[42px] h-[42px] rounded-lg rounded-br-3xl hover:rounded-br-xl !transition-all !duration-400" isLoaded={isLoaded}>
                        <div className="h-3 w-full bg-secondary-300" />
                    </Skeleton>
                </div>
            </div>

        </div>

    )
}

export default ProductCardLoader;