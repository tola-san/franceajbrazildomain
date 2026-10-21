export interface InstagramPost {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  /** Short, indexable headline. Used as VideoObject/ImageObject `name` — the
   *  caption is far too long to serve as a schema name. */
  title: string;
  /** Clean, hashtag-free summary used as the schema `description`. */
  description: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  /** Runtime in whole seconds. VIDEO posts only. */
  durationSeconds?: number;
  width?: number;
  height?: number;
  permalink: string;
  /** Full Instagram caption, rendered in the UI. */
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}
