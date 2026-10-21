"use client"
import { Button } from '@heroui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function NotFound() {
     const router = useRouter()
    return (
        <div className='min-h-[80vh] lg:min-h-screen w-full flex flex-col items-center justify-center text-center px-4'>
            <div className='lg:h-[500px] h-[250px] lg:w-[500px] w-[250px] relative mb-4'>
                <Image src="/images/error/page-error-1.png" alt="404 Not Found" quality={100} fill className='object-contain select-none pointer-events-none' />
            </div>
            <h2 className='text-2xl lg:text-6xl text-primary font-mono'>Oops! Page Not Found</h2>
            <div className='mt-5 max-w-3xl space-y-10 px-5 lg:px-0'>
                <p className='font-sans font-medium text-sm lg:text-base leading-tight'>We’re sorry, but the page you were trying to reach doesn’t exist, has been moved, or may have been deleted. It’s possible the link is outdated, or there might be a small typo in the URL. </p>
                <Button 
                color="primary" 
                onPress={() => router.back()} 
                className='text-white font-mono' 
                size={typeof window !== "undefined" && window.innerWidth < 1024 ? "md" : "lg"}>
                    Go to back
                </Button>
            </div>
        </div>
    )
}