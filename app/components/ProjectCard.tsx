'use client';

interface ProjectCardProps {
  emoji: string;
  title: string;
  description: string;
  link?: string;
  delay: number;
}

export default function ProjectCard({ emoji, title, description, link, delay }: ProjectCardProps) {
  const handleClick = () => {
    if (link) {
      window.open(link, '_blank');
    } else {
      // TODO: Show toast "该项目暂未上线"
      alert('该项目暂未上线');
    }
  };

  return (
    <div
      className="project-card animate-fade-in-up opacity-0"
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
      onClick={handleClick}
    >
      <style jsx>{`
        .project-card {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .project-card:hover {
          transform: scale(1.05) translateY(-5px);
          background: var(--bg-card-hover);
          border-color: var(--border-gold-hover);
          box-shadow: 0 20px 40px rgba(255, 107, 0, 0.3), 0 0 30px var(--dragon-orange-glow);
        }
        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
          transition: left 0.5s ease;
        }
        .project-card:hover::before {
          left: 100%;
        }
        .card-character {
          transition: all 0.3s ease;
        }
        .project-card:hover .card-character {
          opacity: 0.8;
          transform: scale(1.2);
        }
        .card-arrow {
          transition: all 0.3s ease;
        }
        .project-card:hover .card-arrow {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      {/* 光效扫过 */}
      <div className="pointer-events-none" />

      {/* 角色图标 */}
      <div
        className="card-character absolute"
        style={{
          top: '20px',
          right: '20px',
          fontSize: '32px',
          opacity: '0.4',
        }}
      >
        {emoji}
      </div>

      {/* 项目标题 */}
      <h3
        className="font-zcool font-bold text-xl text-white mb-3"
        style={{ paddingRight: '40px' }}
      >
        {title}
      </h3>

      {/* 项目简介 */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {description}
      </p>

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
    </div>
  );
}
