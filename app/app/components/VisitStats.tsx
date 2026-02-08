'use client';

import { useEffect, useState } from 'react';

interface VisitStatsData {
  totalVisits: number;
  todayVisits: number;
  lastDate: string;
}

export default function VisitStats() {
  const [stats, setStats] = useState<VisitStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查今天是否已访问
    const checkVisit = async () => {
      const today = new Date().toISOString().split('T')[0];
      const lastVisit = localStorage.getItem('lastVisitDate');

      // 如果今天还没访问过，更新统计
      if (lastVisit !== today) {
        localStorage.setItem('lastVisitDate', today);
        try {
          const response = await fetch('/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ today }),
          });
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error('Error updating stats:', error);
        }
      }

      // 获取当前统计数据
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error getting stats:', error);
      } finally {
        setLoading(false);
      }
    };

    checkVisit();
  }, []);

  if (loading || !stats) {
    return (
      <div className="text-center py-4 text-[var(--text-secondary)] text-xs relative z-10 border-t border-[var(--border-gold)]">
        访问统计加载中...
      </div>
    );
  }

  return (
    <div className="text-center py-4 text-[var(--text-secondary)] text-xs relative z-10 border-t border-[var(--border-gold)]">
      总访问: {stats.totalVisits} | 今日: {stats.todayVisits}
    </div>
  );
}
