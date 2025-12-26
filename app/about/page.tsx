import Link from 'next/link';

export default function AboutPage() {
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

      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">关于我</h1>
        
        <div className="bg-white rounded-lg p-8 shadow-md">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-3xl">B</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">个人介绍</h2>
              <p className="text-gray-600">技术爱好者 / 开发者</p>
            </div>
          </div>
          
          <div className="space-y-6 text-gray-700">
            <p>
              欢迎来到我的个人技术博客！这里记录了我在学习技术过程中的点点滴滴，
              包括 Linux 系统管理、Docker 容器化、数据库优化、Git 版本控制等实用技术。
            </p>
            
            <p>
              我相信知识的分享能够促进彼此的成长，因此我将这些学习笔记和实践经验
              整理成文章，希望能够帮助到同样对技术充满热情的朋友们。
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">技术栈</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                'Linux', 'Docker', 'MySQL', 'Oracle', 'Git', 
                'Shell Script', 'Makefile', 'Android', 'WSL'
              ].map((tech) => (
                <div key={tech} className="bg-gray-100 rounded-lg p-3 text-center">
                  <span className="font-medium text-gray-800">{tech}</span>
                </div>
              ))}
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-4">联系方式</h3>
            <div className="space-y-2">
              <p>📧 Email: your@email.com</p>
              <p>🐙 GitHub: @yourusername</p>
              <p>🐦 Twitter: @yourhandle</p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                最后更新于 2024年12月26日
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}