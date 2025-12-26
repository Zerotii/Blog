import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import PostCard from '@/components/PostCard';

export default async function Home() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, 6);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          欢迎来到我的技术博客
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          在这里，我分享Linux、Docker、数据库等技术知识，记录学习心得和项目经验。
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/posts" className="btn-primary">
            阅读文章
          </Link>
          <Link href="/about" className="btn-secondary">
            了解更多
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">最新文章</h2>
          <Link 
            href="/posts" 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            查看全部 →
          </Link>
        </div>
        
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">暂无文章，敬请期待！</p>
          </div>
        )}
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">技术分类</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { name: 'Linux', count: 5, color: 'bg-blue-500' },
            { name: 'Docker', count: 3, color: 'bg-blue-600' },
            { name: '数据库', count: 4, color: 'bg-green-500' },
            { name: 'Git', count: 2, color: 'bg-orange-500' },
          ].map((category) => (
            <Link
              key={category.name}
              href={`/categories/${category.name.toLowerCase()}`}
              className="card text-center hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-4 flex items-center justify-center`}>
                <span className="text-white font-bold text-xl">
                  {category.name[0]}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.count} 篇文章</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}