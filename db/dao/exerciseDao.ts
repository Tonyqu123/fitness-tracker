import { db } from '../index';
import { exercises } from '../schema/schema';
import { eq } from 'drizzle-orm';

export interface Exercise {
  id: string;
  name: string;
  category?: string;
  createdAt: Date;
}

export class ExerciseDao {
  // 获取所有训练动作
  static async getAllExercises(): Promise<Exercise[]> {
    const result = await db
      .select()
      .from(exercises)
      .orderBy(exercises.name);
      
    return result.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category || undefined,
      createdAt: new Date(row.createdAt * 1000),
    }));
  }
  
  // 通过ID获取训练动作
  static async getExerciseById(id: string): Promise<Exercise | null> {
    const result = await db
      .select()
      .from(exercises)
      .where(eq(exercises.id, id))
      .limit(1);
      
    if (result.length === 0) {
      return null;
    }
    
    const row = result[0];
    return {
      id: row.id,
      name: row.name,
      category: row.category || undefined,
      createdAt: new Date(row.createdAt * 1000),
    };
  }
  
  // 创建新的训练动作
  static async createExercise(data: { id: string; name: string; category?: string }): Promise<Exercise> {
    const newExercise = {
      id: data.id,
      name: data.name,
      category: data.category,
      createdAt: Math.floor(Date.now() / 1000),
    };
    
    await db.insert(exercises).values(newExercise);
    
    return {
      ...data,
      createdAt: new Date(newExercise.createdAt * 1000),
    };
  }
  
  // 更新训练动作
  static async updateExercise(id: string, data: { name?: string; category?: string }): Promise<Exercise | null> {
    const exercise = await ExerciseDao.getExerciseById(id);
    if (!exercise) {
      return null;
    }
    
    const updateData: Record<string, any> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.category !== undefined) updateData.category = data.category;
    
    await db
      .update(exercises)
      .set(updateData)
      .where(eq(exercises.id, id));
      
    return {
      ...exercise,
      ...data,
    };
  }
  
  // 删除训练动作
  static async deleteExercise(id: string): Promise<boolean> {
    const result = await db
      .delete(exercises)
      .where(eq(exercises.id, id));
      
    return true;
  }
} 