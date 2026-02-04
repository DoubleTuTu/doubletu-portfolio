/**
 * 项目类型定义
 */

export interface Project {
  emoji: string;
  title: string;
  description: string;
  link: string;
}

export interface DragonBallProps {
  stars: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  className?: string;
  style?: React.CSSProperties;
}
