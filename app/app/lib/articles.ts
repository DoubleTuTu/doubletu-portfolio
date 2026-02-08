import fs from 'fs/promises';
import path from 'path';
import { Article, ArticleListItem, ArticlesData } from '../types';

const DATA_FILE_PATH = path.join(process.cwd(), 'app/data/articles.json');

/**
 * 读取所有文章
 */
export async function getAllArticles(): Promise<Article[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const articlesData: ArticlesData = JSON.parse(data);
    return articlesData.articles;
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

/**
 * 获取文章列表（精简版）
 */
export async function getArticleListItems(): Promise<ArticleListItem[]> {
  const articles = await getAllArticles();
  return articles.map(({ id, title, slug, viewCount, publishedAt }) => ({
    id,
    title,
    slug,
    viewCount,
    publishedAt,
  }));
}

/**
 * 根据 slug 获取文章详情
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getAllArticles();
  // URL 解码 slug，处理中文等特殊字符
  const decodedSlug = decodeURIComponent(slug);
  return articles.find(article => article.slug === decodedSlug) || null;
}

/**
 * 根据 id 获取文章
 */
export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await getAllArticles();
  return articles.find(article => article.id === id) || null;
}

/**
 * 创建新文章
 */
export async function createArticle(
  articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>
): Promise<Article> {
  const articles = await getAllArticles();

  // 生成唯一 ID
  const newId = String(Date.now());
  const now = new Date().toISOString();

  const newArticle: Article = {
    ...articleData,
    id: newId,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  articles.push(newArticle);
  await saveArticles(articles);

  return newArticle;
}

/**
 * 更新文章阅读量
 */
export async function incrementViewCount(slug: string): Promise<Article | null> {
  const articles = await getAllArticles();
  // URL 解码 slug，处理中文等特殊字符
  const decodedSlug = decodeURIComponent(slug);
  const articleIndex = articles.findIndex(a => a.slug === decodedSlug);

  if (articleIndex === -1) {
    return null;
  }

  articles[articleIndex].viewCount += 1;
  await saveArticles(articles);

  return articles[articleIndex];
}

/**
 * 删除文章
 */
export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await getAllArticles();
  const filteredArticles = articles.filter(a => a.id !== id);

  if (filteredArticles.length === articles.length) {
    return false; // 文章不存在
  }

  await saveArticles(filteredArticles);
  return true;
}

/**
 * 更新文章标题
 */
export async function updateArticleTitle(
  id: string,
  newTitle: string
): Promise<Article | null> {
  const articles = await getAllArticles();
  const articleIndex = articles.findIndex(a => a.id === id);

  if (articleIndex === -1) {
    return null; // 文章不存在
  }

  articles[articleIndex].title = newTitle;
  articles[articleIndex].updatedAt = new Date().toISOString();

  await saveArticles(articles);
  return articles[articleIndex];
}

/**
 * 保存文章到文件
 */
async function saveArticles(articles: Article[]): Promise<void> {
  const data: ArticlesData = { articles };
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * 生成唯一的 slug
 */
export async function generateUniqueSlug(baseSlug: string): Promise<string> {
  const articles = await getAllArticles();
  let slug = baseSlug;
  let counter = 1;

  while (articles.some(a => a.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
