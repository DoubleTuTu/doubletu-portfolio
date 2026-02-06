'use client';

import { useEffect, useRef } from 'react';

interface CatchphraseBubbleProps {
  emoji: string;
  catchphrase: string;
  isVisible: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export default function CatchphraseBubble({
  emoji,
  catchphrase,
  isVisible,
  onClose,
  position,
}: CatchphraseBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (bubbleRef.current && !bubbleRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      ref={bubbleRef}
      className="fixed z-50 px-3 py-2 md:px-4 md:py-2 rounded-xl pointer-events-none animate-bubble-pop"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-10px)',
        background: 'linear-gradient(135deg, var(--dragon-gold) 0%, var(--dragon-orange) 100%)',
        color: '#000',
        fontWeight: 'bold',
        boxShadow: '0 4px 20px rgba(255, 107, 0, 0.5)',
        minWidth: '120px',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg md:text-xl">{emoji}</span>
        <span className="font-zcool text-sm md:text-base" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.5)' }}>
          {catchphrase}
        </span>
      </div>
      {/* 小三角箭头 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-full"
        style={{
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid var(--dragon-orange)',
        }}
      />

      <style jsx>{`
        @keyframes bubble-pop {
          0% {
            opacity: 0;
            transform: translate(-50%, -100%) translateY(-10px) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -100%) translateY(-15px) scale(1);
          }
        }
        .animate-bubble-pop {
          animation: bubble-pop 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
