import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default async function PostsPage() {
  const allPosts = await getAllPosts();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← 返回首页
        </Link>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">所有文章</h1>
        <p className="text-xl text-gray-600">
          共 {allPosts.length} 篇文章
        </p>
      </header>

      {allPosts.length > 0 ? (
        <div className="space-y-6">
          {allPosts.map((post) => (
            <article key={post.slug} className="card">
              <div className="mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                  <span>{new Date(post.date).toLocaleDateString('zh-CN')}</span>
                  {post.category && (
                    <span className="badge">{post.category}</span>
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">暂无文章，敬请期待！</p>
        </div>
      )}
    </div>
  );
}