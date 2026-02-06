'use client';

interface DragonBallProps {
  stars: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function DragonBall({ stars, className = '', style }: DragonBallProps) {
  // 根据星星数量获取样式
  const getStarStyle = () => {
    const styles: Record<number, React.CSSProperties> = {
      1: { transform: 'translateY(-2px)' },
      2: { letterSpacing: '-2px', transform: 'translateY(-2px)' },
      3: { letterSpacing: '-3px', fontSize: '16px', transform: 'translateY(-1px)' },
      4: { letterSpacing: '-4px', fontSize: '14px', transform: 'translateY(-1px)' },
      5: { letterSpacing: '-5px', fontSize: '12px', transform: 'translateY(0px)' },
      6: { letterSpacing: '-6px', fontSize: '11px', transform: 'translateY(0px)' },
      7: { letterSpacing: '-7px', fontSize: '10px', transform: 'translateY(0px)' },
    };
    return styles[stars] || {};
  };

  const starsText = '★'.repeat(stars);

  return (
    <div
      className={`absolute rounded-full flex items-center justify-center animate-float dragonball ${className}`}
      style={{
        width: '50px',
        height: '50px',
        background: 'radial-gradient(circle at 30% 30%, #ffd966 0%, #ff9500 50%, #e67300 100%)',
        boxShadow:
          'inset -5px -5px 15px rgba(0, 0, 0, 0.4), ' +
          'inset 5px 5px 15px rgba(255, 255, 255, 0.3), ' +
          '0 0 30px var(--dragon-orange-glow), ' +
          '0 0 60px rgba(255, 107, 0, 0.3)',
        transition: 'all 0.3s ease',
        ...style,
      }}
    >
      <span
        style={{
          position: 'absolute',
          color: 'var(--star-red)',
          fontSize: '20px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(204, 0, 0, 0.8)',
          ...getStarStyle(),
        }}
      >
        {starsText}
      </span>

      <style jsx>{`
        .dragonball:hover {
          transform: scale(1.15) rotate(10deg);
          box-shadow:
            inset -5px -5px 15px rgba(0, 0, 0, 0.4),
            inset 5px 5px 15px rgba(255, 255, 255, 0.3),
            0 0 50px var(--dragon-gold),
            0 0 80px var(--dragon-orange),
            0 0 100px rgba(255, 215, 0, 0.6);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
