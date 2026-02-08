import { DragonBall, Navbar, ProjectCard, AIWidget } from './components';
import { getAllProjects } from './lib/projects';

export default async function Home() {
  const PROJECTS = await getAllProjects();
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

      {/* 七颗龙珠 */}
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
          maxWidth: '1200px',
          paddingTop: 'clamp(80px, 15vh, 120px)',
          paddingBottom: '60px'
        }}
      >
        {/* 个人简介 */}
        <section className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h1 className="font-bold mb-4 md:mb-5" style={{ fontSize: 'clamp(32px, 6vw, 56px)', letterSpacing: 'clamp(1px, 0.5vw, 3px)', textShadow: '0 0 40px var(--dragon-orange-glow)', animation: 'glow-pulse 2s ease-in-out infinite' }}>
            <span className="font-bangers" style={{
              background: 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 50%, #ff4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Double</span>
            <span className="font-zcool" style={{
              background: 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 50%, #ff4444 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>兔</span>
          </h1>
          <p
            className="mx-auto mb-4 md:mb-6 px-2"
            style={{
              fontSize: 'clamp(14px, 2.5vw, 18px)',
              color: 'var(--text-secondary)',
              lineHeight: '1.6',
              maxWidth: '600px',
            }}
          >
            <span className="inline-block mx-1 md:mx-3">VibeCoding 爱好者</span>
            <span className="hidden sm:inline">|</span>
            <span className="sm:hidden block my-1">•</span>
            <span className="inline-block mx-1 md:mx-3">用七龙珠的热情敲代码</span>
            <span className="hidden sm:inline">|</span>
            <span className="sm:hidden block my-1">•</span>
            <span className="inline-block mx-1 md:mx-3">极简主义信徒</span>
          </p>
          <p className="text-sm md:text-base" style={{ fontWeight: '700', color: 'var(--dragon-gold)', marginBottom: '10px' }}>✨ 正在开发：用 AI 让世界更有趣</p>
          <p className="text-sm md:text-base" style={{ fontWeight: '700', color: 'var(--dragon-gold)', marginBottom: '10px' }}>目标：集齐七颗龙珠，召唤一个完美的作品集</p>
          <p
            className="flex items-center justify-center gap-2"
            style={{ fontSize: 'clamp(12px, 2vw, 16px)', color: 'var(--text-secondary)' }}
          >
            📞 QQ/微信: 118071452
          </p>
        </section>

        {/* 项目卡片 */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              emoji={project.emoji}
              title={project.title}
              description={project.description}
              link={project.link}
              catchphrase={project.catchphrase}
              imageUrl={project.imageUrl}
              delay={(index + 1) * 100}
            />
          ))}
        </section>
      </div>

      {/* AI 机器人浮窗 */}
      <AIWidget />

      {/* 底部版权 */}
      <footer className="text-center py-8 text-[var(--text-secondary)] text-xs relative z-10 border-t border-[var(--border-gold)]">
        七龙珠角色仅用于个人展示，非商业用途
      </footer>
    </main>
  );
}
