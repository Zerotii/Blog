import Link from 'next/link';
import { getCategories } from '@/lib/posts';

export default async function CategoriesPage() {
  const categories = await getCategories();

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">文章分类</h1>
        <p className="text-xl text-gray-600">
          共 {categories.length} 个分类
        </p>
      </header>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/categories/${encodeURIComponent(category.name)}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {category.name}
                </h2>
                <span className="text-3xl font-bold text-primary-600">
                  {category.count}
                </span>
              </div>
              <p className="text-gray-600">
                {category.count} 篇相关文章
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">暂无分类数据！</p>
        </div>
      )}
    </div>
  );
}