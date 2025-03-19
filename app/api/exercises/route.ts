import { NextRequest, NextResponse } from 'next/server';
import { ExerciseDao } from '@/db/dao/exerciseDao';

// 获取所有训练动作
export async function GET() {
  try {
    const exercises = await ExerciseDao.getAllExercises();
    
    return NextResponse.json({ exercises });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercises' },
      { status: 500 }
    );
  }
}

// 创建新训练动作
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 验证必填字段
    if (!body.id || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields (id, name)' },
        { status: 400 }
      );
    }
    
    const exerciseData = {
      id: body.id,
      name: body.name,
      category: body.category,
    };
    
    const exercise = await ExerciseDao.createExercise(exerciseData);
    
    return NextResponse.json({ exercise }, { status: 201 });
  } catch (error) {
    console.error('Error creating exercise:', error);
    return NextResponse.json(
      { error: 'Failed to create exercise' },
      { status: 500 }
    );
  }
} 