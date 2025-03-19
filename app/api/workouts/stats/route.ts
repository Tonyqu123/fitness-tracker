import { NextRequest, NextResponse } from 'next/server';
import { WorkoutDao } from '@/db/dao/workoutDao';

// 获取训练统计数据
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    
    console.log('Received date parameter:', date);
    
    let statsDate;
    try {
      statsDate = date ? new Date(date) : new Date();
      console.log('Converted date:', statsDate);
    } catch (dateError) {
      console.error('Invalid date format:', date, dateError);
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    const stats = await WorkoutDao.getDailyStats(statsDate);
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching workout stats:', error);
    // More detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Failed to fetch workout stats' },
      { status: 500 }
    );
  }
} 