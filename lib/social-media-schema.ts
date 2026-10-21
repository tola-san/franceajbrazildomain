import type { InstagramPost } from '@/types/instagram';

import posts from '@/components/instagram/mockup-data.json';

const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 'https://www.franceaj.com';

export const socialMediaPosts = posts as InstagramPost[];

const absolute = (url: string) => (url.startsWith('http') ? url : `${baseUrl}${url}`);

/**
 * Instagram permalinks in the feed data are a mix of real post/reel URLs and
 * plain profile links. Only a URL that addresses the individual post is a valid
 * `sameAs` for that piece of media — a profile link would claim the whole
 * account is the same entity as one video.
 */
const postPermalink = (permalink: string) =>
  /\/(reel|reels|p|tv)\//.test(permalink) ? permalink : undefined;

/** Seconds -> ISO 8601 duration ("PT1M8S"), the only form schema.org accepts. */
const isoDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  return `PT${minutes ? `${minutes}M` : ''}${rest || !minutes ? `${rest}S` : ''}`;
};

/**
 * VideoObject / ImageObject markup for the social feed on the homepage.
 *
 * Google indexes the videos themselves (Search Console → Videos report, video
 * rich results and the Video tab) only when each one is described by structured
 * data with, at minimum, name + description + thumbnailUrl + uploadDate, and
 * the video is playable from the page. The MP4s are self-hosted under
 * /public/videos, so `contentUrl` points Google straight at a crawlable file.
 *
 * Engagement counts (likes/comments) are deliberately NOT emitted as
 * `interactionStatistic`: those numbers belong to the Instagram post, not to
 * the video as served here, and unverifiable counts are a spam signal.
 */
export function getSocialMediaSchema(locale: string) {
  const pageUrl = `${baseUrl}/${locale}`;
  const inLanguage = locale === 'pt-br' ? 'pt-BR' : 'en';

  return socialMediaPosts.map((post) => {
    const isVideo = post.type === 'VIDEO';
    const sameAs = postPermalink(post.permalink);

    return {
      '@context': 'https://schema.org',
      '@type': isVideo ? 'VideoObject' : 'ImageObject',
      '@id': `${pageUrl}#${post.id}`,
      name: post.title,
      description: post.description,
      contentUrl: absolute(post.mediaUrl),
      thumbnailUrl: absolute(post.thumbnailUrl || post.mediaUrl),
      uploadDate: post.timestamp,
      ...(isVideo && post.durationSeconds
        ? { duration: isoDuration(post.durationSeconds) }
        : {}),
      ...(post.width ? { width: post.width } : {}),
      ...(post.height ? { height: post.height } : {}),
      // Where a searcher lands when this video wins the result: the homepage,
      // deep-linked to the card that plays it.
      url: `${pageUrl}#${post.id}`,
      inLanguage,
      isFamilyFriendly: true,
      ...(sameAs ? { sameAs } : {}),
      creator: { '@id': `${baseUrl}/#organization` },
      publisher: { '@id': `${baseUrl}/#organization` },
      copyrightHolder: { '@id': `${baseUrl}/#organization` },
      isPartOf: { '@id': `${baseUrl}/#website` },
    };
  });
}

/** Homepage video entries for the XML sitemap (Google video sitemap extension). */
export function getSocialMediaSitemapVideos() {
  return socialMediaPosts
    .filter((post) => post.type === 'VIDEO')
    .map((post) => ({
      title: post.title,
      thumbnail_loc: absolute(post.thumbnailUrl || post.mediaUrl),
      description: post.description,
      content_loc: absolute(post.mediaUrl),
      publication_date: post.timestamp,
      ...(post.durationSeconds ? { duration: post.durationSeconds } : {}),
      family_friendly: 'yes' as const,
      live: 'no' as const,
      uploader: {
        info: baseUrl,
        content: 'France AJ Alimentaire And Food Export And Import LTDA',
      },
    }));
}
