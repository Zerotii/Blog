import Link from 'next/link';
import { PostMetadata } from '@/types/post';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PostCardProps {
  post: PostMetadata;
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = format(new Date(post.date), 'yyyy年MM月dd日', { locale: zhCN });

  return (
    <article className="card">
      <div className="mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
          <span>{formattedDate}</span>
          {post.category && (
            <span className="badge">{post.category}</span>
          )}
          {post.readingTime && (
            <span className="text-gray-400">{post.readingTime}</span>
          )}
        </div>
        
        <Link href={`/posts/${post.slug}`}>
          <h2 className="text-2xl font-semibold text-gray-900 hover:text-primary-600 transition-colors mb-2">
            {post.title}
          </h2>
        </Link>
        
        {post.description && (
          <p className="text-gray-600 mb-3">{post.description}</p>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}