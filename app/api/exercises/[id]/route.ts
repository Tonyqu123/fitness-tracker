import { NextRequest, NextResponse } from 'next/server';
import { ExerciseDao } from '@/db/dao/exerciseDao';

// 获取指定ID的训练动作
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const exercise = await ExerciseDao.getExerciseById(id);
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ exercise });
  } catch (error) {
    console.error(`Error fetching exercise ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch exercise' },
      { status: 500 }
    );
  }
}

// 更新指定ID的训练动作
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();
    
    const exercise = await ExerciseDao.updateExercise(id, {
      name: body.name,
      category: body.category,
    });
    
    if (!exercise) {
      return NextResponse.json(
        { error: 'Exercise not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ exercise });
  } catch (error) {
    console.error(`Error updating exercise ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update exercise' },
      { status: 500 }
    );
  }
}

// 删除指定ID的训练动作
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await ExerciseDao.deleteExercise(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting exercise ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete exercise' },
      { status: 500 }
    );
  }
} 