import { NextRequest, NextResponse } from 'next/server';
import { WorkoutDao, WorkoutCreateInput } from '@/db/dao/workoutDao';

// 获取所有训练记录
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    console.log('Date range request:', { startDate, endDate });
    
    let workouts;
    
    if (startDate && endDate) {
      try {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        console.log('Converted date range:', { startDateObj, endDateObj });
        
        workouts = await WorkoutDao.getWorkoutsByDateRange(startDateObj, endDateObj);
      } catch (dateError) {
        console.error('Date conversion error:', dateError);
        return NextResponse.json(
          { error: 'Invalid date format in range parameters' },
          { status: 400 }
        );
      }
    } else {
      workouts = await WorkoutDao.getAllWorkouts();
    }
    
    return NextResponse.json({ workouts });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    if (error instanceof Error) {
      console.error('Error details:', { name: error.name, message: error.message, stack: error.stack });
    }
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
    console.log('Received workout data:', body);
    
    // 验证必填字段
    if (!body.exercise || body.weight === undefined || body.reps === undefined) {
      console.error('Missing required fields:', body);
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    let workoutDate;
    try {
      workoutDate = body.date ? new Date(body.date) : new Date();
      console.log('Parsed workout date:', workoutDate);
    } catch (dateError) {
      console.error('Invalid date format in workout data:', body.date, dateError);
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
    
    const workoutData: WorkoutCreateInput = {
      exercise: body.exercise,
      weight: Number(body.weight),
      reps: Number(body.reps),
      date: workoutDate,
      userId: body.userId,
    };
    
    const workout = await WorkoutDao.createWorkout(workoutData);
    
    return NextResponse.json({ workout }, { status: 201 });
  } catch (error) {
    console.error('Error creating workout:', error);
    if (error instanceof Error) {
      console.error('Error details:', { name: error.name, message: error.message, stack: error.stack });
    }
    return NextResponse.json(
      { error: 'Failed to create workout' },
      { status: 500 }
    );
  }
} 