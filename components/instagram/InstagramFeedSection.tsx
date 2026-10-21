'use client'

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@heroui/button';
import { FaInstagram } from 'react-icons/fa';
import { siteConfig } from '@/config/site';

import mockupData from './mockup-data.json';
import InstagramFeedCard from './InstagramFeedCard';
import InstagramLightbox from './InstagramLightbox';
import type { InstagramPost } from '@/types/instagram';

export default function InstagramFeedSection() {
    const t = useTranslations('instagram');
    const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Cast raw JSON data to InstagramPost type
    const posts = mockupData as InstagramPost[];

    const handleCardClick = (post: InstagramPost) => {
        setSelectedPost(post);
        setIsLightboxOpen(true);
    };

    const handleCloseLightbox = () => {
        setIsLightboxOpen(false);
        // Delay resetting selected post slightly to avoid visual flash during close transition
        setTimeout(() => {
            setSelectedPost(null);
        }, 300);
    };

    return (
        <section
            className="relative w-full px-4 sm:px-6 lg:px-0 mt-12 sm:mt-20 lg:mt-40 mb-10 lg:mb-32 select-none"
            aria-labelledby="instagram-section-heading"
        >
            <div className="w-full">

                {/* Header Block */}
                <div className="flex flex-col items-center text-center gap-2 sm:gap-3 mb-8 lg:mb-10">
                    <h2
                        id="instagram-section-heading"
                        className="text-2xl lg:text-5xl 2xl:text-6xl font-mono text-primary uppercase font-bold tracking-wide leading-tight lg:leading-none"
                    >
                        {t('title')}
                    </h2>
                    <p className="max-w-2xl text-md lg:text-lg leading-5 lg:leading-tight font-medium">
                        {t('description')}
                    </p>
                </div>

                {/* Feed Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                    {posts.map((post) => (
                        <InstagramFeedCard
                            key={post.id}
                            post={post}
                            onClick={() => handleCardClick(post)}
                        />
                    ))}
                </div>

                {/* Follow CTA Button — closes the section under the grid */}
                <div className="flex justify-center mt-8 lg:mt-12">
                    <Button
                        as="a"
                        href={siteConfig.links.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                        radius="lg"
                        size="lg"
                        startContent={<FaInstagram size={20} />}
                        className="w-full sm:w-auto font-mono text-secondary hover:text-white capitalize font-normal bg-primary rounded-xl px-5 sm:px-6 text-[13px] sm:text-sm"
                        aria-label={t('button')}
                    >
                        {t('button')}
                    </Button>
                </div>

            </div>

            {/* In-app Media Lightbox Viewer */}
            <InstagramLightbox
                isOpen={isLightboxOpen}
                onClose={handleCloseLightbox}
                post={selectedPost}
            />
        </section>
    );
}
