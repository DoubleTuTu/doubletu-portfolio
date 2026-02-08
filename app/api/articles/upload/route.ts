import { NextRequest, NextResponse } from 'next/server';
import { createArticle, generateUniqueSlug } from '../../../lib/articles';
import mammoth from 'mammoth';

/**
 * POST /api/articles/upload - 上传文件创建文章
 *
 * 支持格式：.md, .docx
 * 注：PDF 支持暂不可用，需要额外的服务端配置
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // 处理文件上传
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const customTitle = formData.get('title') as string | null;
      const fileType = formData.get('fileType') as string | null;

      if (!file) {
        return NextResponse.json(
          { error: '请选择文件' },
          { status: 400 }
        );
      }

      const fileExtension = `.${file.name.split('.').pop()}`;

      // 解析文件内容
      let content: string;
      let title = customTitle || file.name.replace(fileExtension, '');

      if (fileExtension === '.md') {
        // Markdown 文件
        content = await file.text();
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch && !customTitle) {
          title = titleMatch[1].trim();
        }
      } else if (fileExtension === '.docx') {
        // Word 文档
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const result = await mammoth.extractRawText({ buffer });
        content = result.value;
      } else if (fileExtension === '.pdf') {
        // PDF 暂不支持
        return NextResponse.json(
          { error: 'PDF 文件暂时不支持，请使用 .md 或 .docx 格式' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { error: '不支持的文件格式，请上传 .md 或 .docx 文件' },
          { status: 400 }
        );
      }

      // 生成 slug
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const slug = await generateUniqueSlug(baseSlug);

      // 创建文章
      const newArticle = await createArticle({
        title,
        slug,
        content: content.trim(),
        publishedAt: new Date().toISOString(),
      });

      return NextResponse.json(
        { article: newArticle },
        { status: 201 }
      );
    } else {
      // 处理 JSON 请求（文本输入）
      const body = await request.json();
      const { title, content } = body;

      if (!title || !content) {
        return NextResponse.json(
          { error: '标题和内容不能为空' },
          { status: 400 }
        );
      }

      // 生成 slug
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
        publishedAt: new Date().toISOString(),
      });

      return NextResponse.json(
        { article: newArticle },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Upload article error:', error);
    return NextResponse.json(
      { error: '上传文章失败: ' + (error instanceof Error ? error.message : '未知错误') },
      { status: 500 }
    );
  }
}
