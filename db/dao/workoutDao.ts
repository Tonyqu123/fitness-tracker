import { db } from '../index';
import { workouts, exercises } from '../schema/schema';
import { eq, and, gte, lte, desc, count, max, sum } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export interface WorkoutRecord {
  id: string;
  exerciseId: string;
  weight: number;
  reps: number;
  date: Date;
  userId?: string;
  createdAt: Date;
}

export interface WorkoutWithExercise extends WorkoutRecord {
  exerciseName: string;
  category?: string;
}

export interface DailyStats {
  totalWeight: number;
  totalSets: number;
  maxWeight: number;
  exerciseCount: number;
}

export interface WorkoutCreateInput {
  exercise: string;
  weight: number;
  reps: number;
  date?: Date;
  userId?: string;
}

export class WorkoutDao {
  // 创建训练记录
  static async createWorkout(input: WorkoutCreateInput): Promise<WorkoutRecord> {
    const workoutDate = input.date || new Date();
    
    const newWorkout = {
      id: uuidv4(),
      exerciseId: input.exercise,
      weight: input.weight,
      reps: input.reps,
      date: workoutDate,
      userId: input.userId,
      createdAt: new Date(),
    };
    
    await db.insert(workouts).values({
      id: newWorkout.id,
      exerciseId: newWorkout.exerciseId,
      weight: newWorkout.weight,
      reps: newWorkout.reps,
      date: Math.floor(newWorkout.date.getTime() / 1000),
      userId: newWorkout.userId,
      createdAt: Math.floor(newWorkout.createdAt.getTime() / 1000),
    });
    
    return newWorkout;
  }
  
  // 获取所有训练记录
  static async getAllWorkouts(): Promise<WorkoutWithExercise[]> {
    const result = await db
      .select({
        id: workouts.id,
        exerciseId: workouts.exerciseId,
        weight: workouts.weight,
        reps: workouts.reps,
        date: workouts.date,
        userId: workouts.userId,
        createdAt: workouts.createdAt,
        exerciseName: exercises.name,
        category: exercises.category,
      })
      .from(workouts)
      .leftJoin(exercises, eq(workouts.exerciseId, exercises.id))
      .orderBy(desc(workouts.date));
      
    return result.map(row => ({
      id: row.id,
      exerciseId: row.exerciseId,
      weight: row.weight,
      reps: row.reps,
      date: new Date(row.date * 1000),
      userId: row.userId,
      createdAt: new Date(row.createdAt * 1000),
      exerciseName: row.exerciseName || '未知动作',
      category: row.category,
    }));
  }
  
  // 获取日期范围内的训练记录
  static async getWorkoutsByDateRange(startDate: Date, endDate: Date): Promise<WorkoutWithExercise[]> {
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);
    
    const result = await db
      .select({
        id: workouts.id,
        exerciseId: workouts.exerciseId,
        weight: workouts.weight,
        reps: workouts.reps,
        date: workouts.date,
        userId: workouts.userId,
        createdAt: workouts.createdAt,
        exerciseName: exercises.name,
        category: exercises.category,
      })
      .from(workouts)
      .leftJoin(exercises, eq(workouts.exerciseId, exercises.id))
      .where(and(
        gte(workouts.date, startTimestamp),
        lte(workouts.date, endTimestamp)
      ))
      .orderBy(desc(workouts.date));
      
    return result.map(row => ({
      id: row.id,
      exerciseId: row.exerciseId,
      weight: row.weight,
      reps: row.reps,
      date: new Date(row.date * 1000),
      userId: row.userId,
      createdAt: new Date(row.createdAt * 1000),
      exerciseName: row.exerciseName || '未知动作',
      category: row.category,
    }));
  }
  
  // 获取今日统计数据
  static async getDailyStats(date: Date = new Date()): Promise<DailyStats> {
    // 获取当天的开始和结束时间戳
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
    const endTimestamp = Math.floor(endOfDay.getTime() / 1000);
    
    // 获取总重量
    const totalWeightResult = await db
      .select({
        total: sum(workouts.weight),
      })
      .from(workouts)
      .where(and(
        gte(workouts.date, startTimestamp),
        lte(workouts.date, endTimestamp)
      ));
    
    // 获取组数
    const totalSetsResult = await db
      .select({
        count: count(),
      })
      .from(workouts)
      .where(and(
        gte(workouts.date, startTimestamp),
        lte(workouts.date, endTimestamp)
      ));
    
    // 获取最大重量
    const maxWeightResult = await db
      .select({
        max: max(workouts.weight),
      })
      .from(workouts)
      .where(and(
        gte(workouts.date, startTimestamp),
        lte(workouts.date, endTimestamp)
      ));
    
    // 获取独特训练动作数量
    const exerciseCountResult = await db
      .select({
        count: count(workouts.exerciseId, { distinct: true }),
      })
      .from(workouts)
      .where(and(
        gte(workouts.date, startTimestamp),
        lte(workouts.date, endTimestamp)
      ));
    
    return {
      totalWeight: totalWeightResult[0]?.total || 0,
      totalSets: totalSetsResult[0]?.count || 0,
      maxWeight: maxWeightResult[0]?.max || 0,
      exerciseCount: exerciseCountResult[0]?.count || 0,
    };
  }
  
  // 删除训练记录
  static async deleteWorkout(id: string): Promise<boolean> {
    const result = await db
      .delete(workouts)
      .where(eq(workouts.id, id));
    
    return true;
  }
} 