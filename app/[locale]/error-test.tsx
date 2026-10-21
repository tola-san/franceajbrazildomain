"use client";

import { Button } from "@heroui/react";
import Image from "next/image";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
        error: Error;
        reset: () => void;
}) {
    useEffect(() => {
        /* eslint-disable no-console */
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center w-full h-screen p-4 text-center">
            <div className="relative w-[350px] h-[350px]">
                <Image
                    src="/images/error/error.png"
                    alt="Error 404"
                    className="object-contain select-none pointer-events-none"
                    loading="lazy"
                    fill
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 350px"
                />
            </div>
            <div className="mt-8 max-w-xl">
                <h2 className="text-xl lg:text-6xl capitalize text-primary">Something went wrong!</h2>
                <p className="text-sm lg:text-base font-medium leading-tight mt-5">Oops! It looks like something didn’t go as expected. This might be due to a temporary glitch, a network issue, or an unexpected error on our end.Please try refreshing the page or come back a little later.
                    If the problem persists, don’t hesitate to contact our support team — we’re here to help!</p>
                <Button onPress={() => reset()} color="primary" className="mt-5 text-white">
                    Try again
                </Button>
            </div>

        </div>
    );
}
