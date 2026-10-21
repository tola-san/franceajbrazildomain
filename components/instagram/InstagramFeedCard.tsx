'use client'

import React from 'react';
import Image from 'next/image';
import { FaPlay, FaRegHeart, FaRegComment } from 'react-icons/fa6';
import { IoCalendar } from 'react-icons/io5';
import type { InstagramPost } from '@/types/instagram';

interface InstagramFeedCardProps {
    post: InstagramPost;
    onClick: () => void;
}

export default function InstagramFeedCard({ post, onClick }: InstagramFeedCardProps) {
    const isVideo = post.type === 'VIDEO';

    return (
        <article
            /* Anchor target for this post's VideoObject/ImageObject @id and url
               (see lib/social-media-schema.ts) — it pairs the markup with the
               element Google actually finds on the page. */
            id={post.id}
            onClick={onClick}
            className="group relative overflow-hidden rounded-[30px] lg:rounded-[50px] bg-white p-3 lg:p-4 cursor-pointer select-none"
        >
            {/* Top: Square Media Container */}
            <div className="relative aspect-square w-full bg-neutral-100 rounded-[22px] lg:rounded-[40px] overflow-hidden">
                {isVideo ? (
                    /* Real poster still (also this video's schema thumbnailUrl), so
                       the card paints without fetching any video bytes up front. */
                    <video
                        src={post.mediaUrl}
                        poster={post.thumbnailUrl}
                        muted
                        playsInline
                        preload="none"
                        aria-label={post.caption}
                        className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                ) : (
                    <Image
                        src={post.mediaUrl}
                        alt={post.caption}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        className="object-cover w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                    />
                )}

                {/* Video Play Icon overlay for idle state */}
                {isVideo && (
                    <div className="absolute top-3 right-3 p-1.5 rounded-md bg-black/60 text-white/90 border border-white/10 z-10">
                        <FaPlay size={8} />
                    </div>
                )}
            </div>

            {/* Bottom: Info Area */}
            <div className="px-2 sm:px-3 lg:px-5 pb-2 lg:pb-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs lg:text-sm font-semibold text-primary/75 mt-4">
                    <div className="flex items-center gap-1.5">
                        <IoCalendar size={14} className="text-primary" />
                        <span>
                            {new Date(post.timestamp).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FaRegHeart size={13} className="text-primary" />
                        <span>{post.likes.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FaRegComment size={13} className="text-primary" />
                        <span>{post.comments.toLocaleString()}</span>
                    </div>
                </div>

                <p className="text-xs sm:text-sm lg:text-base text-black font-medium mt-4 line-clamp-3">
                    {post.caption}
                </p>
            </div>
        </article>
    );
}
