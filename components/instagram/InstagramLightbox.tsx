'use client'

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FaInstagram, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { GoVerified } from 'react-icons/go';
import type { InstagramPost } from '@/types/instagram';

interface InstagramLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    post: InstagramPost | null;
}

export default function InstagramLightbox({ isOpen, onClose, post }: InstagramLightboxProps) {
    const t = useTranslations('instagram');
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Escape key listener to close lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Handle play/pause toggle
    const togglePlay = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play().catch(err => console.error("Error playing video:", err));
        }
        setIsPlaying(!isPlaying);
    };

    // Handle mute toggle
    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    if (!isOpen || !post) return null;

    // Format timestamp
    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-md bg-black/85 transition-all duration-300 animate-fadeIn"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop click to close */}
            <div className="absolute inset-0 cursor-default" onClick={onClose} />

            {/* Lightbox Container */}
            <div className="relative w-full max-w-5xl h-[92vh] sm:h-[88vh] md:h-[75vh] md:max-h-[680px] flex flex-col md:flex-row bg-[#110e0c] rounded-2xl sm:rounded-[24px] overflow-hidden shadow-2xl border border-neutral-800 z-10">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/80 transition-all border border-white/10"
                    aria-label={t('close')}
                >
                    <IoMdClose className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Left Side: Media Display */}
                <div className="relative w-full md:w-[60%] h-[50%] sm:h-[55%] md:h-full shrink-0 bg-black flex items-center justify-center group overflow-hidden">
                    {post.type === 'IMAGE' ? (
                        <div className="relative w-full h-full p-2">
                            <Image
                                src={post.mediaUrl}
                                alt={post.caption}
                                fill
                                sizes="(max-width: 768px) 100vw, 60vw"
                                className="object-contain select-none"
                                priority
                            />
                        </div>
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center bg-black">
                            <video
                                ref={videoRef}
                                src={post.mediaUrl}
                                poster={post.thumbnailUrl}
                                autoPlay
                                loop
                                muted={isMuted}
                                playsInline
                                onClick={togglePlay}
                                className="w-full h-full object-contain cursor-pointer"
                            />
                            
                            {/* Video Play/Pause State Indicator Overlays */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                {!isPlaying && (
                                    <div className="p-4 rounded-full bg-black/60 text-white animate-scaleUp">
                                        <FaPlay size={30} />
                                    </div>
                                )}
                            </div>

                            {/* Control Bar Overlay */}
                            {/* Always visible on touch devices; hover-revealed from md up */}
                            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={togglePlay}
                                    className="p-2.5 sm:p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                                >
                                    {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                                </button>

                                <button
                                    onClick={toggleMute}
                                    className="p-2.5 sm:p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                                >
                                    {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: Details & Sidebar */}
                <div className="w-full md:w-[40%] flex-1 min-h-0 md:h-full flex flex-col justify-between bg-[#191512] text-[#FAF4F0] p-4 sm:p-6 lg:p-8 border-t md:border-t-0 md:border-l border-neutral-800">

                    {/* Header: Company Handle */}
                    <div className="flex items-center gap-3 pb-3 sm:pb-4 border-b border-neutral-800 shrink-0">
                        <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full overflow-hidden border border-neutral-700 bg-white">
                            <Image
                                src="/images/logo/logo-black.png"
                                alt="France AJ Group Logo"
                                fill
                                sizes="40px"
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-sans font-bold text-[13px] sm:text-sm tracking-wide text-[#FAF4F0]">
                                <span className="truncate">france_aj_alimentaire</span>
                                <GoVerified className="text-[#009B3A] shrink-0" size={16} />
                            </div>
                            <div className="text-[11px] sm:text-xs text-neutral-400 font-mono">São Paulo, Brazil</div>
                        </div>
                    </div>

                    {/* Body: Caption Content */}
                    <div className="flex-1 py-4 sm:py-5 overflow-y-auto overscroll-contain min-h-0 scrollbar-thin">
                        <p className="text-[13px] sm:text-sm font-sans leading-relaxed text-neutral-200 whitespace-pre-wrap break-words">
                            {post.caption}
                        </p>
                        <p className="text-[11px] sm:text-xs text-neutral-500 font-mono mt-3 sm:mt-4">
                            {formatDate(post.timestamp)}
                        </p>
                    </div>

                    {/* Footer: Call to Action */}
                    <div className="pt-3 sm:pt-4 border-t border-neutral-800 shrink-0">

                        {/* CTA Link Button */}
                        <a
                            href={post.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#8a3ab9] via-[#e95950] to-[#fccc63] text-white hover:opacity-90 font-mono text-[13px] sm:text-sm tracking-wide transition-all shadow-md active:scale-95"
                        >
                            <FaInstagram size={18} />
                            {t('view_post')}
                        </a>
                    </div>

                </div>

            </div>
        </div>
    );
}
