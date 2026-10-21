export type BlogFile = {
  /** Display name shown on the card, e.g. "Refined Soybean Oil Spec Sheet" */
  name: string;
  /** Public path or absolute URL of the file, e.g. "/files/spec-sheet.pdf" */
  url: string;
  /** Optional override, otherwise inferred from the url extension */
  type?: "pdf" | "image" | "doc" | "sheet" | "other";
  /** Human readable size, e.g. "1.2 MB" */
  size?: string;
  description?: string;
};

export type Blog = {
  id: string;
  title: string;
  slug: string;
  preview: string;
  contentHtml: string;
  author: string;
  publishedAt: string;
  /** Last content revision, ISO date. Falls back to publishedAt when absent. */
  updatedAt?: string;
  coverImage: string;
  /** Optional horizontal banner for detail page hero (16:9). Falls back to coverImage when absent. */
  detailImage?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  faqSchema?: any;
  shortDescription?: string;
  files?: BlogFile[];
};
