'use client';

import { DragonBall, Navbar } from '../../components';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  slug: string;
  viewCount: number;
  publishedAt: string;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      if (response.ok) {
        const result = await response.json();
        const data = result.articles || [];
        // 按发布时间倒序排列
        const sorted = data.sort((a: Article, b: Article) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setArticles(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // 删除文章的函数（客户端调用）
  const deleteArticle = async (id: string, title: string) => {
    if (!confirm(`确定要删除文章《${title}》吗？此操作不可恢复。`)) {
      return;
    }

    try {
      const response = await fetch(`/api/articles?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('文章删除成功！');
        // 重新获取文章列表
        fetchArticles();
      } else {
        const error = await response.json();
        alert(`删除失败：${error.error || '未知错误'}`);
      }
    } catch (error) {
      alert(`删除失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 编辑文章标题的函数
  const editArticleTitle = async (id: string, currentTitle: string) => {
    const newTitle = prompt('请输入新的文章标题：', currentTitle);
    if (newTitle === null || newTitle.trim() === '') {
      return; // 用户取消或输入为空
    }

    try {
      const response = await fetch('/api/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: newTitle.trim() }),
      });

      if (response.ok) {
        alert('标题修改成功！');
        // 重新获取文章列表
        fetchArticles();
      } else {
        const error = await response.json();
        alert(`修改失败：${error.error || '未知错误'}`);
      }
    } catch (error) {
      alert(`修改失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  return (
    <main className="min-h-screen relative">
      <style jsx>{`
        .article-item {
          transition: all 0.3s ease;
        }
        .article-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(255, 107, 0, 0.2);
          border-color: var(--border-gold-hover);
        }
      `}</style>
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
            className="font-bangers font-bold mb-4"
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
            文章管理
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(14px, 2vw, 18px)' }}>
            管理您的所有文章
          </p>
        </section>

        {/* 操作按钮 */}
        <div className="flex gap-4 mb-8 justify-center">
          <Link
            href="/admin/upload"
            className="px-6 py-3 rounded-lg font-zcool font-bold text-base transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 100%)',
              color: '#000',
              boxShadow: '0 0 20px var(--dragon-orange-glow)',
            }}
          >
            ✍️ 上传新文章
          </Link>
          <Link
            href="/articles"
            className="px-6 py-3 rounded-lg font-zcool font-bold text-base transition-all hover:scale-105 border-2"
            style={{
              borderColor: 'var(--border-gold)',
              color: 'var(--dragon-gold)',
            }}
          >
            📰 查看文章列表
          </Link>
        </div>

        {/* 文章列表 */}
        {loading ? (
          <div
            className="text-center py-16 rounded-lg border border-[var(--border-gold)] animate-fade-in-up"
            style={{ background: 'var(--bg-card)' }}
          >
            <p style={{ color: 'var(--text-secondary)' }}>加载中...</p>
          </div>
        ) : articles.length === 0 ? (
          <div
            className="text-center py-16 rounded-lg border border-[var(--border-gold)] animate-fade-in-up"
            style={{ background: 'var(--bg-card)' }}
          >
            <p className="text-2xl mb-4">📝</p>
            <p style={{ color: 'var(--text-secondary)' }}>暂无文章，快去上传第一篇吧！</p>
          </div>
        ) : (
          <div className="space-y-4">
            {articles.map((article, index) => (
              <div
                key={article.id}
                className="animate-fade-in-up opacity-0 article-item"
                style={{
                  animationDelay: `${index * 100}ms`,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                {/* 文章信息 */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="font-zcool font-bold text-lg md:text-xl mb-2 block hover:text-[var(--dragon-gold)] transition-colors"
                    style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                  >
                    {article.title}
                  </Link>
                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span className="flex items-center gap-1">
                      👁 {article.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      📅 {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => editArticleTitle(article.id, article.title)}
                    className="px-4 py-2 rounded-lg font-zcool font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ 修改标题
                  </button>
                  <button
                    onClick={() => deleteArticle(article.id, article.title)}
                    className="px-4 py-2 rounded-lg font-zcool font-bold text-sm transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ 删除
                  </button>
                </div>
              </div>
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
