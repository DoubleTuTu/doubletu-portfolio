'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ArticleCardProps {
  title: string;
  slug: string;
  viewCount: number;
  publishedAt: string;
  delay?: number;
}

export function ArticleCard({ title, slug, viewCount, publishedAt, delay = 0 }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="article-card animate-fade-in-up opacity-0 group relative block"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-gold)',
        borderRadius: '16px',
        padding: '28px',
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        animationDelay: `${delay}ms`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <style jsx>{`
        .article-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .article-card:hover {
          transform: scale(1.05) translateY(-5px);
          background: var(--bg-card-hover);
          border-color: var(--border-gold-hover);
          box-shadow: 0 20px 40px rgba(255, 107, 0, 0.3), 0 0 30px var(--dragon-orange-glow);
        }
        .article-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
          transition: left 0.5s ease;
        }
        .article-card:hover::before {
          left: 100%;
        }
        .card-icon {
          transition: all 0.3s ease;
        }
        .article-card:hover .card-icon {
          opacity: 0.8;
          transform: scale(1.2);
        }
        .card-arrow {
          transition: all 0.3s ease;
        }
        .article-card:hover .card-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* 光效扫过 */}
      <div className="pointer-events-none" />

      {/* 文章图标 */}
      <div
        className="card-icon absolute"
        style={{
          top: '20px',
          right: '20px',
          fontSize: '28px',
          opacity: '0.4',
        }}
      >
        📰
      </div>

      {/* 文章标题 */}
      <h3
        className="font-zcool font-bold text-xl md:text-2xl mb-3 group-hover:text-[var(--dragon-gold)] transition-colors"
        style={{
          color: 'var(--text-primary)',
          letterSpacing: '1px',
          paddingRight: '40px',
        }}
      >
        {title}
      </h3>

      {/* 元信息 */}
      <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-1">
          👁 {viewCount}
        </span>
        <span className="flex items-center gap-1">
          📅 {format(new Date(publishedAt), 'yyyy-MM-dd', { locale: zhCN })}
        </span>
      </div>

      {/* 查看箭头 */}
      <div
        className="card-arrow absolute"
        style={{
          bottom: '20px',
          right: '20px',
          color: 'var(--dragon-gold)',
          fontSize: '20px',
          opacity: '0',
          transform: 'translateX(-10px)',
        }}
      >
        →
      </div>
    </Link>
  );
}
