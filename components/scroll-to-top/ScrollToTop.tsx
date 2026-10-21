'use client';

import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '@heroui/button';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // if (!isVisible) return null;

    return (
        <div className='hidden lg:block'>
            {/* Stacked above the floating WhatsApp launcher, same right column. */}
            <div className="fixed bottom-28 right-[28px] z-50 flex flex-col gap-1 items-center ">
                <Button
                    size='lg'
                    isIconOnly
                    radius='full'
                    color='primary'
                    onPress={scrollToTop}
                    className={`animate-bounce shadow-lg transition-opacity text-background duration-300 ${isVisible ? 'opacity-100 cursor-pointer' : '!opacity-0 cursor-default'}`}
                    aria-label="Scroll to top">
                    <FaArrowUp />
                </Button>
            </div>
        </div>


    );
};

export default ScrollToTop;
