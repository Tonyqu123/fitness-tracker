import { NextRequest, NextResponse } from 'next/server';
import { WorkoutDao } from '@/db/dao/workoutDao';

// 删除指定ID的训练记录
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await WorkoutDao.deleteWorkout(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting workout ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete workout' },
      { status: 500 }
    );
  }
} 