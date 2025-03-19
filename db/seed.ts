import { db, closeDb } from './index';
import { exercises } from './schema/schema';
import { v4 as uuidv4 } from 'uuid';

// 基础训练动作数据
const exercisesData = [
  { id: 'bench-press', name: '卧推', category: '胸部' },
  { id: 'squat', name: '深蹲', category: '腿部' },
  { id: 'deadlift', name: '硬拉', category: '背部' },
  { id: 'pull-up', name: '引体向上', category: '背部' },
  { id: 'push-up', name: '俯卧撑', category: '胸部' },
  { id: 'shoulder-press', name: '肩推', category: '肩部' },
  { id: 'bicep-curl', name: '二头弯举', category: '手臂' },
  { id: 'tricep-extension', name: '三头下压', category: '手臂' },
  { id: 'leg-press', name: '腿推', category: '腿部' },
  { id: 'calf-raise', name: '提踵', category: '腿部' }
];

async function seed() {
  try {
    console.log('开始填充训练动作数据...');
    
    // 检查exercises表是否为空
    const existingExercises = await db.select().from(exercises);
    console.log(`当前exercises表中有 ${existingExercises.length} 条记录`);
    
    if (existingExercises.length > 0) {
      console.log(`表中已有训练动作，跳过填充`);
      return;
    }
    
    // 填充训练动作数据
    for (const exercise of exercisesData) {
      await db.insert(exercises).values({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        createdAt: new Date()
      });
      console.log(`添加训练动作: ${exercise.name} (${exercise.id})`);
    }
    
    console.log(`成功添加 ${exercisesData.length} 个训练动作`);
  } catch (error) {
    console.error('填充数据时出错:', error);
    if (error instanceof Error) {
      console.error('错误信息:', error.message);
      console.error('错误堆栈:', error.stack);
    }
  } finally {
    try {
      await closeDb();
      console.log('数据库连接已关闭');
    } catch (error) {
      console.error('关闭数据库连接时出错:', error);
    }
  }
}

// 执行seed函数
seed(); 