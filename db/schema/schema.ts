import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

// 训练动作表 - 这里存储所有可用的训练动作
export const exercises = sqliteTable("exercises", {
  id: text("id").primaryKey(), // 如 "bench-press", "squat"
  name: text("name").notNull(), // 如 "卧推", "深蹲"
  category: text("category"), // 如 "胸部", "腿部"
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(Date.now()),
});

// 训练记录表 - 这里存储用户的训练记录
export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey(), // 使用UUID或时间戳
  exerciseId: text("exercise_id").notNull().references(() => exercises.id), // 外键关联到exercises表
  weight: integer("weight").notNull(), // 重量，单位为kg
  reps: integer("reps").notNull(), // 重复次数
  date: integer("date", { mode: "timestamp" }).notNull(), // 训练日期
  userId: text("user_id"), // 预留用户ID字段，用于未来扩展多用户支持
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(Date.now()),
});

// 用户表 - 预留用于未来扩展
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(Date.now()),
});

// 用户目标表 - 用于记录用户的训练目标
export const goals = sqliteTable("goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  exerciseId: text("exercise_id").notNull().references(() => exercises.id),
  targetWeight: integer("target_weight").notNull(), // 目标重量
  targetReps: integer("target_reps").notNull(), // 目标重复次数
  deadline: integer("deadline", { mode: "timestamp" }), // 截止日期
  achieved: integer("achieved", { mode: "boolean" }).default(0), // 是否已实现
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(Date.now()),
}); 