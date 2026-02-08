import { NextRequest, NextResponse } from 'next/server';
import { indexAllArticles, indexArticle } from '../../../lib/rag';

/**
 * POST /api/admin/index-articles
 * 索引文章到向量数据库
 *
 * Body:
 * - articleId?: string - 可选，指定要索引的文章 ID。如果不提供，则索引所有文章
 */
export async function POST(request: NextRequest) {
  try {
    // 读取请求文本
    const text = await request.text();
    let articleId: string | undefined = undefined;

    // 如果有内容，尝试解析 JSON
    if (text && text.trim()) {
      try {
        const body = JSON.parse(text);
        articleId = body.articleId;
      } catch {
        // JSON 解析失败，使用默认值
      }
    }

    // 验证环境变量
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key 未配置，请检查 OPENAI_API_KEY 环境变量' },
        { status: 500 }
      );
    }

    if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
      return NextResponse.json(
        { error: 'Upstash Vector 配置未配置，请检查 UPSTASH_VECTOR_REST_URL 和 UPSTASH_VECTOR_REST_TOKEN 环境变量' },
        { status: 500 }
      );
    }

    // 如果指定了文章 ID，只索引该文章
    if (articleId) {
      await indexArticle(articleId);
      return NextResponse.json({
        success: true,
        message: `文章 ${articleId} 索引成功`,
      });
    }

    // 否则索引所有文章
    const result = await indexAllArticles();

    return NextResponse.json({
      success: true,
      message: `索引完成: ${result.indexed} 篇成功, ${result.failed} 篇失败`,
      ...result,
    });
  } catch (error) {
    console.error('Index articles error:', error);
    return NextResponse.json(
      {
        error: '索引失败',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
