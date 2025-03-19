interface FitnessTip {
  title: string
  content: string
}

const fitnessTips: FitnessTip[] = [
  {
    title: "训练前热身的重要性",
    content: "每次训练前进行5-10分钟的动态热身，可以提高肌肉温度，增加关节活动度，减少受伤风险。",
  },
  {
    title: "渐进式超负荷原则",
    content: "想要肌肉生长，必须逐渐增加训练负荷。每周尝试增加重量、次数或组数，给肌肉持续的刺激。",
  },
  {
    title: "复合动作优先",
    content: "复合动作如深蹲、硬拉和卧推能同时锻炼多个肌群，提高训练效率，释放更多生长激素。",
  },
  {
    title: "合理安排休息时间",
    content: "肌肉在休息时生长，不要连续训练同一肌群。大肌群通常需要48-72小时恢复，给身体足够的恢复时间。",
  },
  {
    title: "注意饮食与蛋白质摄入",
    content: "肌肉生长需要足够的营养支持，每公斤体重摄入1.6-2.2克蛋白质，分配在一天的各个餐次中。",
  },
  {
    title: "保持良好姿势",
    content: "正确的动作姿势比举起更重的重量更重要。错误姿势不仅降低训练效果，还会增加受伤风险。",
  },
  {
    title: "训练日志的价值",
    content: "记录每次训练的重量、组数和感受，帮助你追踪进步，调整训练计划，保持动力。",
  },
  {
    title: "不要忽视核心训练",
    content: "强大的核心肌群是所有力量训练的基础，提高稳定性，减少背部问题，改善整体表现。",
  },
  {
    title: "充分补水很重要",
    content: "训练前、中、后保持充分水分摄入，有助于维持表现，加速恢复，减少肌肉酸痛。",
  },
  {
    title: "睡眠是最好的恢复手段",
    content: "每晚保证7-9小时的优质睡眠，这是肌肉修复和生长的黄金时间，也是提高训练表现的关键。",
  },
]

export function getRandomFitnessTip(): FitnessTip {
  const randomIndex = Math.floor(Math.random() * fitnessTips.length)
  return fitnessTips[randomIndex]
}

export function getAllFitnessTips(): FitnessTip[] {
  return [...fitnessTips]
}

