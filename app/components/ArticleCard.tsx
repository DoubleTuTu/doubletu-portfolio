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
      className="group relative block p-6 rounded-lg border border-[var(--border-gold)] hover:border-[var(--border-gold-hover)] transition-all duration-300"
      style={{
        background: 'var(--bg-card)',
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease forwards',
        opacity: 0,
      }}
    >
      {/* 能量光晕效果 */}
      <div
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--dragon-orange-glow) 0%, transparent 70%)',
        }}
      />

      {/* 内容 */}
      <div className="relative z-10">
        <h3
          className="font-bangers font-bold mb-3 text-xl md:text-2xl group-hover:text-[var(--dragon-gold)] transition-colors"
          style={{
            color: 'var(--text-primary)',
            letterSpacing: '1px',
          }}
        >
          {title}
        </h3>

        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1">
            👁 {viewCount}
          </span>
          <span className="flex items-center gap-1">
            📅 {format(new Date(publishedAt), 'yyyy-MM-dd', { locale: zhCN })}
          </span>
        </div>
      </div>
    </Link>
  );
}
