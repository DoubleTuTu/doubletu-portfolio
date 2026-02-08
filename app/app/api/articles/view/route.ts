import { NextRequest, NextResponse } from 'next/server';
import { incrementViewCount } from '../../../lib/articles';

/**
 * POST /api/articles/view - 增加文章阅读量
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: '缺少文章 slug' },
        { status: 400 }
      );
    }

    const article = await incrementViewCount(slug);

    if (!article) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ viewCount: article.viewCount });
  } catch (error) {
    console.error('Increment view count error:', error);
    return NextResponse.json(
      { error: '更新阅读量失败' },
      { status: 500 }
    );
  }
}
