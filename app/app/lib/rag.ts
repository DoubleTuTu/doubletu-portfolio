/**
 * RAG (Retrieval Augmented Generation) 工具
 * 用于文章索引、向量搜索和 AI 知识库
 */

import { generateEmbedding, generateBatchEmbeddings } from './embeddings';
import { upsertBatchVectors, searchVectors, VectorDocument, VectorSearchResult } from './vector';
import { getAllArticles } from './articles';

/**
 * 文本块接口
 */
export interface TextChunk {
  text: string;
  articleId: string;
  articleTitle: string;
  chunkIndex: number;
}

/**
 * RAG 搜索结果接口
 */
export interface RAGSearchResult {
  chunk: string;
  articleId: string;
  articleTitle: string;
  score: number;
}

/**
 * 文章分块配置
 */
const CHUNK_CONFIG = {
  maxChunkSize: 500, // 每块最大字符数
  chunkOverlap: 50, // 块之间重叠字符数
  minChunkSize: 100, // 最小块大小
};

/**
 * 将文章内容分块
 * @param content 文章内容 (Markdown)
 * @param articleId 文章 ID
 * @param articleTitle 文章标题
 * @returns 文本块数组
 */
export function chunkArticle(content: string, articleId: string, articleTitle: string): TextChunk[] {
  const chunks: TextChunk[] = [];

  // 移除 Markdown 语法，保留纯文本
  const cleanContent = content
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\*\*/g, '') // 移除粗体标记
    .replace(/\*/g, '') // 移除斜体标记
    .replace(/`{1,3}/g, '') // 移除代码标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接，保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n\s*\n/g, '\n\n') // 标准化换行
    .trim();

  // 按段落分割
  const paragraphs = cleanContent.split(/\n\n+/);

  let currentChunk = '';
  let chunkIndex = 0;

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();

    // 如果单个段落超过最大块大小，需要进一步分割
    if (trimmedParagraph.length > CHUNK_CONFIG.maxChunkSize) {
      // 先保存当前块（如果有内容）
      if (currentChunk.length > CHUNK_CONFIG.minChunkSize) {
        chunks.push({
          text: currentChunk.trim(),
          articleId,
          articleTitle,
          chunkIndex: chunkIndex++,
        });
        currentChunk = '';
      }

      // 分割长段落
      let remainingText = trimmedParagraph;
      while (remainingText.length > CHUNK_CONFIG.maxChunkSize) {
        const splitPoint = CHUNK_CONFIG.maxChunkSize - CHUNK_CONFIG.chunkOverlap;
        chunks.push({
          text: remainingText.slice(0, CHUNK_CONFIG.maxChunkSize).trim(),
          articleId,
          articleTitle,
          chunkIndex: chunkIndex++,
        });
        remainingText = remainingText.slice(splitPoint);
      }
      currentChunk = remainingText;
    } else {
      // 添加到当前块
      currentChunk += (currentChunk ? '\n\n' : '') + trimmedParagraph;

      // 如果当前块超过最大大小，保存并开始新块
      if (currentChunk.length > CHUNK_CONFIG.maxChunkSize) {
        chunks.push({
          text: currentChunk.trim(),
          articleId,
          articleTitle,
          chunkIndex: chunkIndex++,
        });
        // 保留重叠部分
        const overlapStart = Math.max(0, currentChunk.length - CHUNK_CONFIG.chunkOverlap);
        currentChunk = currentChunk.slice(overlapStart);
      }
    }
  }

  // 保存最后一个块
  if (currentChunk.length > CHUNK_CONFIG.minChunkSize) {
    chunks.push({
      text: currentChunk.trim(),
      articleId,
      articleTitle,
      chunkIndex,
    });
  }

  return chunks;
}

/**
 * 索引单篇文章到向量数据库
 * @param articleId 文章 ID
 */
export async function indexArticle(articleId: string): Promise<void> {
  const articles = await getAllArticles();
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    throw new Error(`Article with ID ${articleId} not found`);
  }

  // 分块
  const chunks = chunkArticle(article.content, article.id, article.title);

  if (chunks.length === 0) {
    console.warn(`No chunks generated for article ${articleId}`);
    return;
  }

  // 生成 embeddings
  const texts = chunks.map(c => c.text);
  const embeddings = await generateBatchEmbeddings(texts);

  // 准备向量文档
  const vectorDocs: VectorDocument[] = chunks.map((chunk, index) => ({
    id: `${articleId}-chunk-${chunk.chunkIndex}`,
    vector: embeddings[index],
    metadata: {
      articleId: chunk.articleId,
      articleTitle: chunk.articleTitle,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
    },
  }));

  // 批量上传到向量数据库
  await upsertBatchVectors(vectorDocs);

  console.log(`Indexed article ${articleId} with ${chunks.length} chunks`);
}

/**
 * 索引所有文章到向量数据库
 */
export async function indexAllArticles(): Promise<{ indexed: number; failed: number }> {
  const articles = await getAllArticles();
  let indexed = 0;
  let failed = 0;

  for (const article of articles) {
    try {
      await indexArticle(article.id);
      indexed++;
    } catch (error) {
      console.error(`Failed to index article ${article.id}:`, error);
      failed++;
    }
  }

  console.log(`Indexing complete: ${indexed} succeeded, ${failed} failed`);
  return { indexed, failed };
}

/**
 * 向量搜索相关文章内容
 * @param query 查询文本
 * @param topK 返回结果数量
 * @returns 搜索结果数组
 */
export async function searchRelatedContent(query: string, topK: number = 3): Promise<RAGSearchResult[]> {
  // 生成查询向量
  const queryVector = await generateEmbedding(query);

  // 向量搜索
  const vectorResults = await searchVectors(queryVector, topK);

  // 转换为 RAG 搜索结果
  const ragResults: RAGSearchResult[] = vectorResults
    .filter(result => result.metadata)
    .map(result => ({
      chunk: (result.metadata?.text as string) || '',
      articleId: (result.metadata?.articleId as string) || '',
      articleTitle: (result.metadata?.articleTitle as string) || '',
      score: result.score,
    }))
    .filter(result => result.chunk.length > 0);

  return ragResults;
}

/**
 * 生成 RAG 增强的提示词
 * @param query 用户查询
 * @param searchResults 搜索结果
 * @returns 增强后的提示词
 */
export function buildRAGPrompt(query: string, searchResults: RAGSearchResult[]): string {
  if (searchResults.length === 0) {
    return query;
  }

  // 构建上下文
  const context = searchResults
    .map((result, index) => {
      return `[文章片段 ${index + 1}]
来源: ${result.articleTitle}
相关度: ${(result.score * 100).toFixed(1)}%
内容: ${result.chunk}
`;
    })
    .join('\n---\n\n');

  // 构建增强提示词
  const prompt = `你是一个乐于助人的 AI 助手。根据以下相关文章片段回答用户问题。

【相关文章内容】
${context}

【用户问题】
${query}

请根据以上文章内容回答问题。如果文章内容中没有相关信息，请诚实告知，不要编造答案。`;

  return prompt;
}

/**
 * RAG 查询完整流程（搜索 + 生成提示词）
 * @param query 用户查询
 * @param topK 搜索结果数量
 * @returns 包含上下文的提示词
 */
export async function ragQuery(query: string, topK: number = 3): Promise<string> {
  const searchResults = await searchRelatedContent(query, topK);
  return buildRAGPrompt(query, searchResults);
}
