import { ArticleCard, DragonBall, Navbar } from '../components';
import { getAllArticles } from '../lib/articles';

export const metadata = {
  title: '文章 - Double兔 作品集',
  description: 'Double兔 的技术文章与思考分享',
};

export default async function ArticlesPage() {
  const articles = await getAllArticles();

  // 按发布时间倒序排列
  const sortedArticles = articles.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main className="min-h-screen relative">
      {/* 能量光晕背景 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 animate-energy-pulse"
          style={{
            background: `
              radial-gradient(circle at 20% 20%, var(--dragon-orange-glow) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(255, 107, 0, 0.1) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      {/* 网格线装饰 */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 107, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* 龙珠装饰 - 七颗龙珠 */}
      <DragonBall stars={1} style={{ top: '10%', left: '5%' }} />
      <DragonBall stars={2} style={{ top: '20%', right: '8%' }} />
      <DragonBall stars={3} style={{ top: '60%', left: '3%' }} />
      <DragonBall stars={4} style={{ top: '70%', right: '5%' }} />
      <DragonBall stars={5} style={{ top: '40%', left: '92%' }} />
      <DragonBall stars={6} style={{ top: '85%', left: '10%' }} />
      <DragonBall stars={7} style={{ top: '50%', right: '3%' }} />

      {/* 导航栏 */}
      <Navbar />

      {/* 主内容 */}
      <div
        className="relative z-10 mx-auto px-4 sm:px-6 md:px-10"
        style={{
          maxWidth: '900px',
          paddingTop: 'clamp(80px, 15vh, 120px)',
          paddingBottom: '60px'
        }}
      >
        {/* 页面标题 */}
        <section className="text-center mb-12 animate-fade-in-up">
          <h1
            className="font-zcool font-bold mb-4"
            style={{
              fontSize: 'clamp(32px, 6vw, 56px)',
              background: 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 50%, #ff4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: 'clamp(1px, 0.5vw, 3px)',
              textShadow: '0 0 40px var(--dragon-orange-glow)',
              animation: 'glow-pulse 2s ease-in-out infinite',
            }}
          >
            文章列表
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(14px, 2vw, 18px)' }}>
            技术分享 · 思考记录 · 学习心得
          </p>
        </section>

        {/* 文章列表 */}
        {sortedArticles.length === 0 ? (
          <div
            className="text-center py-16 rounded-lg border border-[var(--border-gold)]"
            style={{ background: 'var(--bg-card)' }}
          >
            <p className="text-2xl mb-4">📝</p>
            <p style={{ color: 'var(--text-secondary)' }}>暂无文章，敬请期待...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {sortedArticles.map((article, index) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                viewCount={article.viewCount}
                publishedAt={article.publishedAt}
                delay={(index + 1) * 100}
              />
            ))}
          </div>
        )}
      </div>

      {/* 底部版权 */}
      <footer className="text-center py-8 text-[var(--text-secondary)] text-xs relative z-10 border-t border-[var(--border-gold)]">
        七龙珠角色仅用于个人展示，非商业用途
      </footer>
    </main>
  );
}
