import { NextRequest, NextResponse } from 'next/server';
import { WorkoutDao, WorkoutCreateInput } from '@/db/dao/workoutDao';

// 获取所有训练记录
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let workouts;
    
    if (startDate && endDate) {
      workouts = await WorkoutDao.getWorkoutsByDateRange(
        new Date(startDate),
        new Date(endDate)
      );
    } else {
      workouts = await WorkoutDao.getAllWorkouts();
    }
    
    return NextResponse.json({ workouts });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

// 创建训练记录
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 验证必填字段
    if (!body.exercise || body.weight === undefined || body.reps === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const workoutData: WorkoutCreateInput = {
      exercise: body.exercise,
      weight: Number(body.weight),
      reps: Number(body.reps),
      date: body.date ? new Date(body.date) : new Date(),
      userId: body.userId,
    };
    
    const workout = await WorkoutDao.createWorkout(workoutData);
    
    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
} 