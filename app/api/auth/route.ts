import { NextRequest, NextResponse } from 'next/server';

// 简单的密码验证 - 在生产环境中应该使用更安全的方法
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // 默认密码

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: '密码不能为空' },
        { status: 400 }
      );
    }

    // 验证密码
    if (password === ADMIN_PASSWORD) {
      // 在实际生产环境中，这里应该：
      // 1. 生成JWT token
      // 2. 设置安全的cookie
      // 3. 添加过期时间等
      
      // 这里使用简单的session storage作为演示
      return NextResponse.json({ 
        success: true, 
        message: '登录成功',
        // 在生产环境中不应该返回敏感信息
        token: 'demo-token-' + Date.now()
      });
    } else {
      return NextResponse.json(
        { success: false, error: '密码错误' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, error: '认证失败' },
      { status: 500 }
    );
  }
}