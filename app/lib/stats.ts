import fs from 'fs';
import path from 'path';

export interface VisitStats {
  totalVisits: number;
  todayVisits: number;
  lastDate: string;
}

const STATS_FILE_PATH = path.join(process.cwd(), 'app/data/stats.json');

// 确保数据文件存在
function ensureStatsFile(): VisitStats {
  try {
    if (fs.existsSync(STATS_FILE_PATH)) {
      const data = fs.readFileSync(STATS_FILE_PATH, 'utf-8');
      return JSON.parse(data) as VisitStats;
    }
  } catch (error) {
    console.error('Error reading stats file:', error);
  }

  // 文件不存在或读取失败，创建默认值
  const defaultStats: VisitStats = {
    totalVisits: 0,
    todayVisits: 0,
    lastDate: '',
  };

  try {
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(defaultStats, null, 2));
  } catch (error) {
    console.error('Error creating stats file:', error);
  }

  return defaultStats;
}

// 获取访问统计
export async function getStats(): Promise<VisitStats> {
  return ensureStatsFile();
}

// 更新访问统计（当天首次访问时调用）
export async function updateStats(today: string): Promise<VisitStats> {
  const stats = ensureStatsFile();

  // 检查是否是新的一天
  if (stats.lastDate !== today) {
    // 新的一天，重置今日访问量
    stats.todayVisits = 1;
    stats.lastDate = today;
  } else {
    // 同一天，今日访问量 +1
    stats.todayVisits += 1;
  }

  // 总访问量始终 +1
  stats.totalVisits += 1;

  // 写入文件
  try {
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Error updating stats file:', error);
  }

  return stats;
}
