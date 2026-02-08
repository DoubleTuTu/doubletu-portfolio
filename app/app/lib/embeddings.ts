/**
 * OpenAI Embeddings 工具
 * 用于将文本转换为向量表示
 */

import OpenAI from 'openai';

// 初始化 OpenAI 客户端
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openaiClient = new OpenAI({
      apiKey,
      timeout: 120000, // 120 秒超时
    });
  }
  return openaiClient;
}

/**
 * 生成单个文本的 embedding
 * @param text 要转换的文本
 * @returns embedding 向量 (1536 维)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const client = getOpenAIClient();

    const response = await client.embeddings.create({
      model: 'text-embedding-3-small', // 性价比高，1536 维
      input: text,
      encoding_format: 'float',
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error(`Failed to generate embedding: ${error}`);
  }
}

/**
 * 批量生成 embeddings
 * @param texts 文本数组
 * @returns embedding 向量数组
 */
export async function generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    const client = getOpenAIClient();

    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
      encoding_format: 'float',
    });

    return response.data.map(item => item.embedding);
  } catch (error) {
    console.error('Error generating batch embeddings:', error);
    throw new Error(`Failed to generate batch embeddings: ${error}`);
  }
}

/**
 * 计算两个向量之间的余弦相似度
 * @param vecA 向量 A
 * @param vecB 向量 B
 * @returns 相似度分数 (0-1)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
