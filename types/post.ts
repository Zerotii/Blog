export interface PostMetadata {
  title: string;
  description?: string;
  date: string;
  category?: string;
  tags?: string[];
  slug: string;
  readingTime: string;
}

export interface Post extends PostMetadata {
  content: string;
}

export interface CategoryInfo {
  name: string;
  count: number;
  posts: Post[];
}