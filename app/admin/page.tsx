'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostMetadata } from '@/types/post';
import AdminAuth from '@/components/AdminAuth';

interface AdminTab {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const adminTabs: AdminTab[] = [
  {
    id: 'posts',
    name: '文章管理',
    description: '编辑文章标签和元数据',
    icon: '📝'
  },
  {
    id: 'deploy',
    name: '一键部署',
    description: '部署到GitHub Pages或Vercel',
    icon: '🚀'
  },
  {
    id: 'settings',
    name: '博客设置',
    description: '配置博客基本信息',
    icon: '⚙️'
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // 检查是否已经认证
  useEffect(() => {
    const checkAuth = () => {
      // 检查sessionStorage中是否有认证标记
      const authToken = sessionStorage.getItem('admin_auth_token');
      const authTime = sessionStorage.getItem('admin_auth_time');
      
      if (authToken && authTime) {
        const now = Date.now();
        const authTimestamp = parseInt(authTime);
        // 8小时后过期
        const expiryTime = 8 * 60 * 60 * 1000;
        
        if (now - authTimestamp < expiryTime) {
          setIsAuthenticated(true);
        } else {
          // 已过期，清除session
          sessionStorage.removeItem('admin_auth_token');
          sessionStorage.removeItem('admin_auth_time');
        }
      }
      
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  const handleAuthenticated = () => {
    // 设置认证标记
    sessionStorage.setItem('admin_auth_token', 'admin_' + Date.now());
    sessionStorage.setItem('admin_auth_time', Date.now().toString());
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // 清除认证标记
    sessionStorage.removeItem('admin_auth_token');
    sessionStorage.removeItem('admin_auth_time');
    setIsAuthenticated(false);
  };

  // 显示加载状态
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">加载中...</p>
        </div>
      </div>
    );
  }

  // 如果未认证，显示登录页面
  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={handleAuthenticated} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return <PostsManager onPostsChange={setPosts} />;
      case 'deploy':
        return <DeployManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">博客管理后台</h1>
              <p className="text-gray-600 mt-1">管理您的技术博客内容</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                ← 返回博客
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded border border-red-300 hover:border-red-400 transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">功能菜单</h2>
                <nav className="space-y-2">
                  {adminTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{tab.icon}</span>
                        <div>
                          <div className="font-medium">{tab.name}</div>
                          <div className="text-sm text-gray-500">{tab.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Posts Manager Component
function PostsManager({ onPostsChange }: { onPostsChange: (posts: PostMetadata[]) => void }) {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PostMetadata>>({});

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPosts = async () => {
    try {
      const response = await fetch('/data/posts.json');
      const data = await response.json();
      setPosts(data);
      onPostsChange(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: PostMetadata) => {
    setEditingPost(post.slug);
    setEditForm(post);
  };

  const handleSave = async () => {
    if (!editingPost) return;
    
    try {
      // 这里应该调用API来更新文章
      console.log('Saving post:', editForm);
      
      // 模拟保存过程
      setTimeout(() => {
        alert('文章更新成功！');
        setEditingPost(null);
        loadPosts();
      }, 1000);
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('保存失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">加载中...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">文章管理</h2>
        <button
          onClick={loadPosts}
          className="btn-secondary"
        >
          🔄 刷新
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.slug} className="border border-gray-200 rounded-lg p-4">
            {editingPost === post.slug ? (
              <EditForm
                post={post}
                form={editForm}
                setForm={setEditForm}
                onSave={handleSave}
                onCancel={() => setEditingPost(null)}
              />
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                  <p className="text-gray-600 mt-1">{post.description}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="badge">{post.category}</span>
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <span className="text-sm text-gray-500">{post.readingTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(post)}
                  className="ml-4 btn-primary"
                >
                  编辑
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Edit Form Component
function EditForm({
  post,
  form,
  setForm,
  onSave,
  onCancel
}: {
  post: PostMetadata;
  form: Partial<PostMetadata>;
  setForm: (form: Partial<PostMetadata>) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const updateField = (field: keyof PostMetadata, value: any) => {
    setForm({ ...form, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">标题</label>
        <input
          type="text"
          value={form.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">描述</label>
        <textarea
          value={form.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
        <input
          type="text"
          value={form.category || ''}
          onChange={(e) => updateField('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">标签 (用逗号分隔)</label>
        <input
          type="text"
          value={form.tags?.join(', ') || ''}
          onChange={(e) => updateField('tags', e.target.value.split(',').map(tag => tag.trim()))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          placeholder="标签1, 标签2, 标签3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
        <input
          type="date"
          value={form.date || ''}
          onChange={(e) => updateField('date', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      <div className="flex space-x-3">
        <button onClick={onSave} className="btn-primary">
          保存
        </button>
        <button onClick={onCancel} className="btn-secondary">
          取消
        </button>
      </div>
    </div>
  );
}

// Deploy Manager Component
function DeployManager() {
  const [deploying, setDeploying] = useState<string | null>(null);
  const [deployConfig, setDeployConfig] = useState({
    github: {
      username: 'yourusername',
      repoName: 'personal-blog'
    },
    vercel: {
      projectName: 'personal-blog'
    }
  });

  const handleDeploy = async (platform: string) => {
    setDeploying(platform);
    try {
      const config = deployConfig[platform as keyof typeof deployConfig];
      
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          platform,
          config
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        showDeploySuccess(platform, result);
      } else {
        showDeployError(platform, result);
      }
    } catch (error) {
      console.error('Deploy error:', error);
      alert('部署失败，请检查网络连接');
    } finally {
      setDeploying(null);
    }
  };

  const showDeploySuccess = (platform: string, result: any) => {
    const message = `${platform} 部署成功！\n\n` +
      `URL: ${result.url}\n\n` +
      `${result.message}\n\n` +
      `步骤:\n${result.steps?.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n') || ''}`;
    
    alert(message);
    
    // 如果有网站URL，尝试打开
    if (result.url) {
      const open = confirm('是否打开部署的网站？');
      if (open) {
        window.open(result.url, '_blank');
      }
    }
  };

  const showDeployError = (platform: string, result: any) => {
    const message = `${platform} 部署失败！\n\n` +
      `错误: ${result.error}\n\n` +
      `说明: ${result.message}\n\n` +
      `下一步:\n${result.nextSteps?.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n') || ''}`;
    
    alert(message);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">一键部署</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GitHub Pages */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
              GH
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">GitHub Pages</h3>
              <p className="text-gray-600">部署到GitHub免费静态托管</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              免费托管
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              自定义域名
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              自动部署
            </div>
          </div>
          <button
            onClick={() => handleDeploy('github')}
            disabled={deploying === 'github'}
            className="w-full btn-primary disabled:opacity-50"
          >
            {deploying === 'github' ? '部署中...' : '部署到GitHub Pages'}
          </button>
        </div>

        {/* Vercel */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
              V
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Vercel</h3>
              <p className="text-gray-600">部署到Vercel高性能平台</p>
            </div>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              全球CDN
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              自动扩容
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              持续集成
            </div>
          </div>
          <button
            onClick={() => handleDeploy('vercel')}
            disabled={deploying === 'vercel'}
            className="w-full btn-primary disabled:opacity-50"
          >
            {deploying === 'vercel' ? '部署中...' : '部署到Vercel'}
          </button>
        </div>
      </div>

      {/* Deployment Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">部署说明</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• 首次部署需要配置GitHub仓库或Vercel账户</p>
          <p>• 部署前会自动构建静态文件并生成最新的RSS源</p>
          <p>• 部署成功后会自动打开新的标签页显示网站</p>
          <p>• 如遇到问题，请检查网络连接和账户权限</p>
        </div>
      </div>
    </div>
  );
}

// Settings Manager Component
function SettingsManager() {
  const [settings, setSettings] = useState({
    siteName: '我的技术博客',
    siteDescription: '分享Linux、Docker、数据库等技术知识',
    authorName: '博客作者',
    rssTitle: '我的技术博客',
    githubRepo: '',
    vercelProject: ''
  });

  const handleSave = () => {
    // 这里应该保存设置到配置文件
    alert('设置已保存！');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">博客设置</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">网站名称</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">网站描述</label>
          <textarea
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">作者名称</label>
          <input
            type="text"
            value={settings.authorName}
            onChange={(e) => setSettings({ ...settings, authorName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">RSS订阅标题</label>
          <input
            type="text"
            value={settings.rssTitle}
            onChange={(e) => setSettings({ ...settings, rssTitle: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">部署配置</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub仓库地址</label>
              <input
                type="text"
                value={settings.githubRepo}
                onChange={(e) => setSettings({ ...settings, githubRepo: e.target.value })}
                placeholder="https://github.com/username/repository"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vercel项目名称</label>
              <input
                type="text"
                value={settings.vercelProject}
                onChange={(e) => setSettings({ ...settings, vercelProject: e.target.value })}
                placeholder="project-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button onClick={handleSave} className="btn-primary">
            保存设置
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn-secondary"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
}