import { NextRequest, NextResponse } from 'next/server';
import { WorkoutDao } from '@/db/dao/workoutDao';

// 获取训练统计数据
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    
    const stats = await WorkoutDao.getDailyStats(date ? new Date(date) : new Date());
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching workout stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout stats' },
      { status: 500 }
    );
  }
} 