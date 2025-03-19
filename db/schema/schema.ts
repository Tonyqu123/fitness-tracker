import { pgTable, text, integer, primaryKey, timestamp, boolean } from "drizzle-orm/pg-core";

// 训练动作表 - 这里存储所有可用的训练动作
export const exercises = pgTable("exercises", {
  id: text("id").primaryKey(), // 如 "bench-press", "squat"
  name: text("name").notNull(), // 如 "卧推", "深蹲"
  category: text("category"), // 如 "胸部", "腿部"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 训练记录表 - 这里存储用户的训练记录
export const workouts = pgTable("workouts", {
  id: text("id").primaryKey(), // 使用UUID或时间戳
  exerciseId: text("exercise_id").notNull().references(() => exercises.id), // 外键关联到exercises表
  weight: integer("weight").notNull(), // 重量，单位为kg
  reps: integer("reps").notNull(), // 重复次数
  date: timestamp("date").notNull(), // 训练日期
  userId: text("user_id"), // 预留用户ID字段，用于未来扩展多用户支持
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 用户表 - 预留用于未来扩展
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 用户目标表 - 用于记录用户的训练目标
export const goals = pgTable("goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  exerciseId: text("exercise_id").notNull().references(() => exercises.id),
  targetWeight: integer("target_weight").notNull(), // 目标重量
  targetReps: integer("target_reps").notNull(), // 目标重复次数
  deadline: timestamp("deadline"), // 截止日期
  achieved: boolean("achieved").default(false), // 是否已实现
  createdAt: timestamp("created_at").notNull().defaultNow(),
}); 