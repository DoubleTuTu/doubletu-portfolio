import { NextRequest, NextResponse } from 'next/server';
import { getStats, updateStats } from '@/app/lib/stats';

// GET - 获取访问统计
export async function GET() {
  try {
    const stats = await getStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { error: '访问统计加载失败' },
      { status: 500 }
    );
  }
}

// POST - 更新访问统计
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { today } = body;

    if (!today) {
      return NextResponse.json(
        { error: '缺少 today 参数' },
        { status: 400 }
      );
    }

    const stats = await updateStats(today);
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error updating stats:', error);
    return NextResponse.json(
      { error: '访问统计更新失败' },
      { status: 500 }
    );
  }
}
