/**
 * Upstash Vector 客户端工具
 * 用于向量存储和相似度搜索
 */

import { Index } from '@upstash/vector';

// 向量索引客户端
let vectorIndex: Index | null = null;

/**
 * 获取 Upstash Vector 客户端
 */
function getVectorIndex(): Index {
  if (!vectorIndex) {
    const url = process.env.UPSTASH_VECTOR_REST_URL;
    const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        'UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN environment variables must be set'
      );
    }

    vectorIndex = new Index({
      url,
      token,
    });
  }
  return vectorIndex;
}

/**
 * 向量文档接口
 */
export interface VectorDocument {
  id: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}

/**
 * 向量搜索结果接口
 */
export interface VectorSearchResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}

/**
 * 上传单个向量文档
 * @param doc 向量文档
 */
export async function upsertVector(doc: VectorDocument): Promise<void> {
  try {
    const index = getVectorIndex();
    await index.upsert({
      id: doc.id,
      vector: doc.vector,
      metadata: doc.metadata,
    });
  } catch (error) {
    console.error('Error upserting vector:', error);
    throw new Error(`Failed to upsert vector: ${error}`);
  }
}

/**
 * 批量上传向量文档
 * @param docs 向量文档数组
 */
export async function upsertBatchVectors(docs: VectorDocument[]): Promise<void> {
  try {
    const index = getVectorIndex();

    // Upstash Vector 批量上传
    await index.upsert(
      docs.map(doc => ({
        id: doc.id,
        vector: doc.vector,
        metadata: doc.metadata,
      }))
    );
  } catch (error) {
    console.error('Error upserting batch vectors:', error);
    throw new Error(`Failed to upsert batch vectors: ${error}`);
  }
}

/**
 * 向量相似度搜索
 * @param queryVector 查询向量
 * @param topK 返回最相似的 K 个结果
 * @returns 搜索结果数组
 */
export async function searchVectors(
  queryVector: number[],
  topK: number = 5
): Promise<VectorSearchResult[]> {
  try {
    const index = getVectorIndex();

    const results = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    });

    return results.map(match => ({
      id: String(match.id || ''),
      score: match.score || 0,
      metadata: match.metadata as Record<string, unknown> | undefined,
    }));
  } catch (error) {
    console.error('Error searching vectors:', error);
    throw new Error(`Failed to search vectors: ${error}`);
  }
}

/**
 * 删除向量文档
 * @param id 文档 ID
 */
export async function deleteVector(id: string): Promise<void> {
  try {
    const index = getVectorIndex();
    await index.delete(id);
  } catch (error) {
    console.error('Error deleting vector:', error);
    throw new Error(`Failed to delete vector: ${error}`);
  }
}

/**
 * 批量删除向量文档
 * @param ids 文档 ID 数组
 */
export async function deleteBatchVectors(ids: string[]): Promise<void> {
  try {
    const index = getVectorIndex();
    await index.delete(ids);
  } catch (error) {
    console.error('Error deleting batch vectors:', error);
    throw new Error(`Failed to delete batch vectors: ${error}`);
  }
}

/**
 * 清空所有向量
 */
export async function clearAllVectors(): Promise<void> {
  try {
    const index = getVectorIndex();
    // 注意：Upstash Vector 不支持直接清空，需要通过查询所有 ID 然后批量删除
    // 这是一个简化的实现，实际使用中可能需要维护 ID 列表
    const results = await index.query({
      vector: Array(1536).fill(0), // 假向量用于查询所有
      topK: 1000, // 假设不超过 1000 个文档
      includeMetadata: false,
    });

    if (results.length > 0) {
      const ids = results.map(r => r.id).filter(Boolean) as string[];
      await index.delete(ids);
    }
  } catch (error) {
    console.error('Error clearing all vectors:', error);
    throw new Error(`Failed to clear vectors: ${error}`);
  }
}

/**
 * 获取向量文档数量
 */
export async function countVectors(): Promise<number> {
  try {
    const index = getVectorIndex();
    // 使用假向量查询来估算数量
    const results = await index.query({
      vector: Array(1536).fill(0),
      topK: 10000,
      includeMetadata: false,
    });
    return results.length;
  } catch (error) {
    console.error('Error counting vectors:', error);
    return 0;
  }
}
