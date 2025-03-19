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
  userId?: string | null;
  createdAt: Date;
}

export interface WorkoutWithExercise extends WorkoutRecord {
  exerciseName: string;
  category?: string | null;
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
    
    // Validate that workoutDate is indeed a Date object
    if (!(workoutDate instanceof Date) || isNaN(workoutDate.getTime())) {
      console.error('Invalid date object for workout creation:', workoutDate);
      throw new Error('Invalid date for workout creation');
    }
    
    const newWorkout = {
      id: uuidv4(),
      exerciseId: input.exercise,
      weight: input.weight,
      reps: input.reps,
      date: workoutDate,
      userId: input.userId,
      createdAt: new Date(),
    };
    
    try {
      // PostgreSQL expects proper Date objects, not Unix timestamps
      await db.insert(workouts).values({
        id: newWorkout.id,
        exerciseId: newWorkout.exerciseId,
        weight: newWorkout.weight,
        reps: newWorkout.reps,
        date: newWorkout.date,
        userId: newWorkout.userId,
        createdAt: newWorkout.createdAt,
      });
      
      return newWorkout;
    } catch (error) {
      console.error('Database error during workout creation:', error);
      throw error;
    }
  }
  
  // 获取所有训练记录
  static async getAllWorkouts(): Promise<WorkoutWithExercise[]> {
    try {
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
        
      return result.map(row => {
        try {
          // PostgreSQL automatically converts timestamps to Date objects
          return {
            id: row.id,
            exerciseId: row.exerciseId,
            weight: row.weight,
            reps: row.reps,
            date: row.date,
            userId: row.userId,
            createdAt: row.createdAt,
            exerciseName: row.exerciseName || '未知动作',
            category: row.category,
          };
        } catch (error) {
          console.error('Error converting row to workout:', row, error);
          // Return a fallback object with current date
          return {
            id: row.id || 'unknown',
            exerciseId: row.exerciseId || 'unknown',
            weight: row.weight || 0,
            reps: row.reps || 0,
            date: new Date(),
            userId: row.userId,
            createdAt: new Date(),
            exerciseName: row.exerciseName || '未知动作',
            category: row.category,
          };
        }
      });
    } catch (error) {
      console.error('Database error during getAllWorkouts:', error);
      throw error;
    }
  }
  
  // 获取日期范围内的训练记录
  static async getWorkoutsByDateRange(startDate: Date, endDate: Date): Promise<WorkoutWithExercise[]> {
    // Validate dates
    if (!(startDate instanceof Date) || !(endDate instanceof Date) || 
        isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Invalid date object for date range query:', { startDate, endDate });
      throw new Error('Invalid date range for workout query');
    }
    
    try {
      console.log('Query date range:', { startDate, endDate });
      
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
          gte(workouts.date, startDate),
          lte(workouts.date, endDate)
        ))
        .orderBy(desc(workouts.date));
      
      console.log(`Found ${result.length} workouts in date range`);
        
      return result.map(row => {
        try {
          return {
            id: row.id,
            exerciseId: row.exerciseId,
            weight: row.weight,
            reps: row.reps,
            date: row.date,
            userId: row.userId,
            createdAt: row.createdAt,
            exerciseName: row.exerciseName || '未知动作',
            category: row.category,
          };
        } catch (error) {
          console.error('Error converting row to workout in date range:', row, error);
          return {
            id: row.id || 'unknown',
            exerciseId: row.exerciseId || 'unknown',
            weight: row.weight || 0,
            reps: row.reps || 0,
            date: new Date(),
            userId: row.userId,
            createdAt: new Date(),
            exerciseName: row.exerciseName || '未知动作',
            category: row.category,
          };
        }
      });
    } catch (error) {
      console.error('Database error during getWorkoutsByDateRange:', error);
      throw error;
    }
  }
  
  // 获取今日统计数据
  static async getDailyStats(date: Date = new Date()): Promise<DailyStats> {
    // Validate date
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error('Invalid date object for daily stats:', date);
      throw new Error('Invalid date for daily stats');
    }
    
    // 获取当天的开始和结束时间戳
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    console.log('Daily stats date range:', { startOfDay, endOfDay });
    
    try {
      // 获取总重量
      const totalWeightResult = await db
        .select({
          total: sum(workouts.weight),
        })
        .from(workouts)
        .where(and(
          gte(workouts.date, startOfDay),
          lte(workouts.date, endOfDay)
        ));
      
      // 获取组数
      const totalSetsResult = await db
        .select({
          count: count(),
        })
        .from(workouts)
        .where(and(
          gte(workouts.date, startOfDay),
          lte(workouts.date, endOfDay)
        ));
      
      // 获取最大重量
      const maxWeightResult = await db
        .select({
          max: max(workouts.weight),
        })
        .from(workouts)
        .where(and(
          gte(workouts.date, startOfDay),
          lte(workouts.date, endOfDay)
        ));
      
      // 获取独特训练动作数量
      const exerciseCountResult = await db
        .select({
          count: count(workouts.exerciseId),
        })
        .from(workouts)
        .where(and(
          gte(workouts.date, startOfDay),
          lte(workouts.date, endOfDay)
        ));
      
      // Ensure all values are numbers
      const stats: DailyStats = {
        totalWeight: Number(totalWeightResult[0]?.total || 0),
        totalSets: Number(totalSetsResult[0]?.count || 0),
        maxWeight: Number(maxWeightResult[0]?.max || 0),
        exerciseCount: Number(exerciseCountResult[0]?.count || 0),
      };

      console.log('Daily stats result:', stats);
      
      return stats;
    } catch (error) {
      console.error('Database error during getDailyStats:', error);
      throw error;
    }
  }
  
  // 删除训练记录
  static async deleteWorkout(id: string): Promise<boolean> {
    try {
      const result = await db
        .delete(workouts)
        .where(eq(workouts.id, id));
      
      return true;
    } catch (error) {
      console.error('Database error during deleteWorkout:', error);
      throw error;
    }
  }
} 