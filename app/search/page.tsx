'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostMetadata } from '@/types/post';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PostMetadata[]>([]);
  const [allPosts, setAllPosts] = useState<PostMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/data/posts.json');
        const posts = await response.json();
        setAllPosts(posts);
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };
    loadPosts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    // 延迟搜索，避免频繁搜索
    const timeoutId = setTimeout(() => {
      const results = allPosts.filter(post => {
        const searchLower = searchTerm.toLowerCase();
        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.description?.toLowerCase().includes(searchLower) ||
          post.category?.toLowerCase().includes(searchLower) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
      
      setSearchResults(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, allPosts]);

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">搜索文章</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="输入关键词搜索文章..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
      </div>

      {searchTerm && (
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? '搜索中...' : `找到 ${searchResults.length} 篇相关文章`}
            {searchResults.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">
                搜索词: "{searchTerm}"
              </span>
            )}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {searchResults.length > 0 ? (
          searchResults.map((post) => (
            <article key={post.slug} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <Link 
                  href={`/posts/${post.slug}`}
                  className="text-xl font-semibold text-primary-600 hover:text-primary-700"
                >
                  {highlightText(post.title, searchTerm)}
                </Link>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {post.date}
                </span>
              </div>
              
              {post.description && (
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {highlightText(post.description, searchTerm)}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {post.category && (
                    <span className="badge">
                      {highlightText(post.category, searchTerm)}
                    </span>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                        >
                          #{highlightText(tag, searchTerm)}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  阅读全文 →
                </Link>
              </div>
            </article>
          ))
        ) : searchTerm && !isLoading ? (
          <div className="text-center py-12">
            <svg 
              className="w-16 h-16 text-gray-300 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关文章</h3>
            <p className="text-gray-500 mb-4">
              尝试使用不同的关键词，或者
              <Link href="/" className="text-primary-600 hover:text-primary-700 ml-1">
                浏览所有文章
              </Link>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="font-medium text-blue-900 mb-2">搜索建议:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 使用更具体的关键词</li>
                <li>• 检查拼写是否正确</li>
                <li>• 尝试使用相关的技术术语</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg 
              className="w-16 h-16 text-gray-300 mx-auto mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">开始搜索</h3>
            <p className="text-gray-500">
              输入关键词来搜索技术文章、教程和笔记
            </p>
          </div>
        )}
      </div>
    </div>
  );
}