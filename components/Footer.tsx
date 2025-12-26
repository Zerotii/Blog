export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">个人博客</h3>
            <p className="text-gray-400">
              分享技术知识和学习心得，记录成长路上的点点滴滴。
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">技术栈</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Next.js 14</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>MDX</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">联系方式</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: your@email.com</li>
              <li>GitHub: @yourusername</li>
              <li>Twitter: @yourhandle</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 个人博客. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  );
}