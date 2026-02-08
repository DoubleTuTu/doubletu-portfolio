'use client';

import { useState, useRef } from 'react';
import CatchphraseBubble from './CatchphraseBubble';

interface ProjectCardProps {
  emoji: string;
  title: string;
  description: string;
  link?: string;
  catchphrase?: string;
  imageUrl?: string;
  delay: number;
}

export default function ProjectCard({ emoji, title, description, link, catchphrase, imageUrl, delay }: ProjectCardProps) {
  const [showBubble, setShowBubble] = useState(false);
  const [bubblePosition, setBubblePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleCardClick = () => {
    if (link) {
      window.open(link, '_blank');
    } else {
      alert('该项目暂未上线');
    }
  };

  const handleMouseEnter = () => {
    if (!catchphrase || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setBubblePosition({
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
    setShowBubble(true);
  };

  const handleMouseLeave = () => {
    setShowBubble(false);
  };

  return (
    <>
      {/* 气泡提示 */}
      {catchphrase && (
        <CatchphraseBubble
          emoji={emoji}
          catchphrase={catchphrase}
          isVisible={showBubble}
          onClose={() => setShowBubble(false)}
          position={bubblePosition}
        />
      )}

      <div
        ref={cardRef}
        className="project-card animate-fade-in-up opacity-0"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          borderRadius: '16px',
          padding: '28px',
          position: 'relative',
          cursor: 'pointer',
          zIndex: 1,
          animationDelay: `${delay}ms`,
          backdropFilter: 'blur(10px)',
        }}
        onClick={handleCardClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <style jsx>{`
          .project-card {
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          .project-card:hover {
            transform: scale(1.05) translateY(-5px);
            background: var(--bg-card-hover);
            border-color: var(--border-gold-hover);
            box-shadow: 0 15px 30px rgba(255, 107, 0, 0.25), 0 0 25px var(--dragon-orange-glow);
            z-index: 10;
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
            pointer-events: none;
            opacity: 0;
            z-index: 0;
          }
          .project-card:hover::before {
            left: 100%;
            opacity: 1;
          }
          .card-character {
            transition: all 0.3s ease;
          }
          .project-card:hover .card-character {
            opacity: 0.8;
            transform: scale(1.2) rotate(5deg);
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

        {/* 角色图标/图片 */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="card-character absolute"
            style={{
              top: '15px',
              right: '15px',
              width: '48px',
              height: '48px',
              objectFit: 'cover',
              borderRadius: '8px',
              opacity: '0.7',
              border: '1px solid var(--border-gold)',
            }}
          />
        ) : (
          <div
            className="card-character character-emoji absolute"
            style={{
              top: '20px',
              right: '20px',
              fontSize: '32px',
              opacity: '0.4',
            }}
          >
            {emoji}
          </div>
        )}

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
    </>
  );
}
