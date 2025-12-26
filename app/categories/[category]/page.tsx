import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostsByCategory, getCategories } from '@/lib/posts';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface PageProps {
  params: {
    category: string;
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map((category) => ({
    category: encodeURIComponent(category.name),
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  // URL解码分类名称
  const decodedCategory = decodeURIComponent(params.category);
  const posts = await getPostsByCategory(decodedCategory);

  if (posts.length === 0) {
    notFound();
  }

  const formattedDate = (date: string) => {
    return format(new Date(date), 'yyyy年MM月dd日', { locale: zhCN });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← 返回首页
        </Link>
        <Link 
          href="/categories"
          className="text-primary-600 hover:text-primary-700 font-medium ml-4"
        >
          ← 返回分类
        </Link>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {decodedCategory}
        </h1>
        <p className="text-xl text-gray-600">
          共 {posts.length} 篇文章
        </p>
      </header>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="card hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <Link 
                href={`/posts/${post.slug}`}
                className="text-xl font-semibold text-primary-600 hover:text-primary-700"
              >
                {post.title}
              </Link>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                {formattedDate(post.date)}
              </span>
            </div>
            
            {post.description && (
              <p className="text-gray-600 mb-3 line-clamp-2">
                {post.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {post.category && (
                  <span className="badge">
                    {post.category}
                  </span>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
                {post.readingTime && (
                  <span className="text-xs text-gray-500">
                    {post.readingTime}
                  </span>
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
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无相关文章</h3>
          <p className="text-gray-500 mb-4">
            该分类下还没有文章内容
          </p>
          <Link
            href="/"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            返回首页
          </Link>
        </div>
      )}
    </div>
  );
}