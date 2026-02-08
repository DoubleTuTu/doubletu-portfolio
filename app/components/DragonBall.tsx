'use client';

interface DragonBallProps {
  stars: number;
  className?: string;
  style?: React.CSSProperties;
}

// 绘制五角星形状
function Star({ cx, cy, size }: { cx: number; cy: number; size: number }) {
  const points: [number, number][] = [];
  const outerRadius = size;
  const innerRadius = size * 0.4;

  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }

  const pointsStr = points.map(p => p.join(',')).join(' ');

  return <polygon points={pointsStr} fill="var(--star-red)" />;
}

export default function DragonBall({ stars, className = '', style }: DragonBallProps) {
  // 使用 SVG 绘制星星图案
  const getStarsPattern = () => {
    const starSize = 4.5;
    const center = 25;

    switch (stars) {
      case 1: // 一星球：中间 1 颗
        return <Star cx={center} cy={center} size={starSize} />;

      case 2: // 二星球：上下竖排
        return (
          <>
            <Star cx={center} cy={center - 8} size={starSize} />
            <Star cx={center} cy={center + 8} size={starSize} />
          </>
        );

      case 3: // 三星球：三角形排列
        return (
          <>
            <Star cx={center} cy={center - 10} size={starSize} />
            <Star cx={center - 9} cy={center + 7} size={starSize} />
            <Star cx={center + 9} cy={center + 7} size={starSize} />
          </>
        );

      case 4: // 四星球：菱形排列
        return (
          <>
            <Star cx={center} cy={center - 9} size={starSize} />
            <Star cx={center - 9} cy={center} size={starSize} />
            <Star cx={center + 9} cy={center} size={starSize} />
            <Star cx={center} cy={center + 9} size={starSize} />
          </>
        );

      case 5: // 五星球：五角星排列
        return (
          <>
            <Star cx={center} cy={center - 11} size={starSize} />
            <Star cx={center + 10} cy={center - 3} size={starSize} />
            <Star cx={center + 7} cy={center + 9} size={starSize} />
            <Star cx={center - 7} cy={center + 9} size={starSize} />
            <Star cx={center - 10} cy={center - 3} size={starSize} />
          </>
        );

      case 6: // 六星球：五边形 + 中心
        return (
          <>
            <Star cx={center} cy={center} size={starSize * 0.85} />
            <Star cx={center} cy={center - 12} size={starSize} />
            <Star cx={center + 11} cy={center - 4} size={starSize} />
            <Star cx={center + 8} cy={center + 9} size={starSize} />
            <Star cx={center - 8} cy={center + 9} size={starSize} />
            <Star cx={center - 11} cy={center - 4} size={starSize} />
          </>
        );

      case 7: // 七星球：六边形排列 + 中心 1 颗
        const hexRadius = 11;
        return (
          <>
            <Star cx={center} cy={center} size={starSize} />
            <Star cx={center} cy={center - hexRadius} size={starSize} />
            <Star cx={center + hexRadius * 0.866} cy={center - hexRadius * 0.5} size={starSize} />
            <Star cx={center + hexRadius * 0.866} cy={center + hexRadius * 0.5} size={starSize} />
            <Star cx={center} cy={center + hexRadius} size={starSize} />
            <Star cx={center - hexRadius * 0.866} cy={center + hexRadius * 0.5} size={starSize} />
            <Star cx={center - hexRadius * 0.866} cy={center - hexRadius * 0.5} size={starSize} />
          </>
        );

      default:
        return null;
    }
  };

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
      <svg width="50" height="50" viewBox="0 0 50 50">
        {getStarsPattern()}
      </svg>

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
