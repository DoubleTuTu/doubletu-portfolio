/**
 * 项目类型定义
 */

export interface Project {
  emoji: string;
  title: string;
  description: string;
  link: string;
}

export interface DragonBallProps {
  stars: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 文章类型定义（V0.2 新增）
 */

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  viewCount: number;
  publishedAt: string; // ISO 8601
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListItem {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  publishedAt: string;
}

export interface ArticleDetail extends Article {
  // 继承所有字段
}

export interface ArticlesData {
  articles: Article[];
}
