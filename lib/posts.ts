import { Post, PostMetadata } from '@/types/post';
import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'public', 'data');

function readJsonFileSync(filename: string) {
  try {
    const filePath = path.join(dataDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

async function fetchJsonData(filename: string) {
  // 在服务器端使用 fs，客户端使用 fetch
  if (typeof window === 'undefined') {
    return readJsonFileSync(filename);
  } else {
    try {
      const response = await fetch(`/data/${filename}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${filename}:`, error);
      return null;
    }
  }
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  const postsData = await fetchJsonData('posts.json');
  return postsData || [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const postData = await fetchJsonData(`post-${slug}.json`);
  return postData || null;
}

export async function getPostsByCategory(category: string): Promise<PostMetadata[]> {
  const posts = await getAllPosts();
  return posts.filter(post => post.category === category);
}

export async function getCategories(): Promise<{ name: string; count: number; posts: PostMetadata[] }[]> {
  const categoriesData = await fetchJsonData('categories.json');
  return categoriesData || [];
}

export async function getAllTags(): Promise<string[]> {
  const tagsData = await fetchJsonData('tags.json');
  return tagsData || [];
}