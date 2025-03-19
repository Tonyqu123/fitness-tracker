import { db } from './index';
import { exercises } from './schema/schema';
import { v4 as uuidv4 } from 'uuid';

// 初始化训练动作数据
async function seedExercises() {
  console.log('Seeding exercises...');
  
  const initialExercises = [
    { id: 'bench-press', name: '卧推', category: '胸部' },
    { id: 'squat', name: '深蹲', category: '腿部' },
    { id: 'deadlift', name: '硬拉', category: '背部' },
    { id: 'pull-up', name: '引体向上', category: '背部' },
    { id: 'shoulder-press', name: '肩推', category: '肩部' },
    { id: 'barbell-row', name: '杠铃划船', category: '背部' },
    { id: 'leg-press', name: '腿推', category: '腿部' },
    { id: 'bicep-curl', name: '二头弯举', category: '手臂' },
  ];

  // 检查是否已存在数据，避免重复插入
  const existingExercises = await db.select().from(exercises);
  
  if (existingExercises.length === 0) {
    await db.insert(exercises).values(initialExercises);
    console.log(`Inserted ${initialExercises.length} exercises.`);
  } else {
    console.log('Exercises already seeded, skipping...');
  }
}

// 执行所有种子数据函数
async function seed() {
  try {
    await seedExercises();
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// 执行种子数据导入
seed(); 