import { NextRequest, NextResponse } from 'next/server';
import {
  getAllArticles,
  getArticleListItems,
  createArticle,
  deleteArticle,
  generateUniqueSlug,
} from '../../lib/articles';

/**
 * GET /api/articles - 获取文章列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const simple = searchParams.get('simple');

    if (simple === 'true') {
      // 返回精简列表
      const articles = await getArticleListItems();
      // 按发布时间倒序排列
      articles.sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      return NextResponse.json({ articles });
    }

    // 返回完整列表
    const articles = await getAllArticles();
    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Get articles error:', error);
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles - 创建新文章
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, publishedAt } = body;

    // 验证必填字段
    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    // 生成 slug（从标题转换）
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const slug = await generateUniqueSlug(baseSlug);

    // 创建文章
    const newArticle = await createArticle({
      title,
      slug,
      content,
      publishedAt: publishedAt || new Date().toISOString(),
    });

    return NextResponse.json(
      { article: newArticle },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create article error:', error);
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/articles - 删除文章
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '缺少文章 ID' },
        { status: 400 }
      );
    }

    const success = await deleteArticle(id);

    if (!success) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    );
  }
}
