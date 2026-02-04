'use client';

import { ArticleUploader, DragonBall, Navbar } from '../../components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminUploadPage() {
  const router = useRouter();

  const handleUploadSuccess = (article: any) => {
    // 上传成功后跳转到文章详情页
    router.push(`/articles/${article.slug}`);
  };

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

      {/* 龙珠装饰 */}
      <DragonBall stars={1} style={{ top: '10%', left: '5%' }} />
      <DragonBall stars={2} style={{ top: '20%', right: '8%' }} />
      <DragonBall stars={3} style={{ top: '60%', left: '3%' }} />
      <DragonBall stars={4} style={{ top: '70%', right: '5%' }} />

      {/* 导航栏 */}
      <Navbar />

      {/* 主内容 */}
      <div
        className="relative z-10 mx-auto px-4 sm:px-6 md:px-10"
        style={{
          maxWidth: '700px',
          paddingTop: 'clamp(80px, 15vh, 120px)',
          paddingBottom: '60px'
        }}
      >
        {/* 返回按钮 */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 mb-6 text-sm hover:text-[var(--dragon-gold)] transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← 返回文章列表
        </Link>

        {/* 页面标题 */}
        <section className="text-center mb-12 animate-fade-in-up">
          <h1
            className="font-bangers font-bold mb-4"
            style={{
              fontSize: 'clamp(32px, 5vw, 48px)',
              background: 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 50%, #ff4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '2px',
              textShadow: '0 0 40px var(--dragon-orange-glow)',
            }}
          >
            上传文章
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(14px, 2vw, 18px)' }}>
            支持 Markdown 文件上传或直接输入内容
          </p>
        </section>

        {/* 上传组件 */}
        <ArticleUploader onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* 底部版权 */}
      <footer className="text-center py-8 text-[var(--text-secondary)] text-xs relative z-10 border-t border-[var(--border-gold)]">
        七龙珠角色仅用于个人展示，非商业用途
      </footer>
    </main>
  );
}
