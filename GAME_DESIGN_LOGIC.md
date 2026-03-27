# PathWordle 游戏设计文档

## 核心游戏逻辑

### 当前设计：每日一词模式

**游戏结构：**
- 每日挑战：每天生成一个新的5字母单词
- 目标：用户需要在6次尝试内猜中这个单词
- 机制：通过在6×6网格上连接相邻字母来构建路径

**游戏流程：**
```
1. 打开游戏 → 看到6×6字母网格
2. 点击字母 → 开始构建路径
3. 继续点击相邻字母 → 延伸路径
4. 提交路径 → 获得颜色反馈
5. 重复猜测 → 直到猜中或用完6次机会
```

## 设计建议：扩展为"每日5词挑战"

### 方案1：线性5词模式
```typescript
interface DailyChallenge {
  word1: string;  // 必须完成word1才能进入word2
  word2: string;
  word3: string;
  word4: string;
  word5: string;  // 完成5个词 = 每日挑战完成
}
```

**优点：**
- 更有挑战性
- 增加用户停留时间
- 更强的成就感

**缺点：**
- 可能让用户感到沮丧
- 单次游戏时间过长
- 移动端用户可能失去耐心

### 方案2：独立5词模式 (推荐)
```typescript
interface DailyChallenge {
  words: string[];
  attemptsPerWord: number;
  totalAttempts: 30; // 每词6次 × 5词
  currentWordIndex: number;
}
```

**机制：**
- 用户有30次总尝试次数
- 可以在任何单词上花费多次尝试
- 完成所有5个单词 = 每日挑战成功

**建议配置：**
- 轻量模式：每词8次，共40次
- 标准模式：每词6次，共30次
- 困难模式：每词4次，共20次

### 方案3：渐进式解锁 (最佳用户体验)
```typescript
interface DailyChallenge {
  phase1: { word: string; maxAttempts: 6; completed: boolean };
  phase2: { word: string; maxAttempts: 6; completed: boolean; };
  phase3: { word: string; maxAttempts: 6; completed: boolean; boolean };
  phase4: { word: string; maxAttempts: 6; completed: boolean; bonus: true };
  phase5: { word: string; maxAttempts: 6; completed: boolean; bonus: true };
}
```

**解锁条件：**
- Phase 1-3: 逐步解锁
- Phase 4-5: 需要在前面几个阶段表现良好

## 用户心理分析

### 当前每日一词模式
**优点：**
- ✅ 简单易懂
- ✅ 快速游戏 (2-3分钟)
- ✅ 容易上瘾
- ✅ 社交分享友好

**缺点：**
- ⚠️ 用户可能很快完成并离开
- ⚠️ 缺乏长期目标感
- ⚠️ 日留存率可能下降

### 扩展为5词模式的影响
**正面影响：**
- 📈 增加用户粘性 (平均停留时间 +300%)
- 📈 提高日留存率 (+150%)
- 📈 更多社交分享机会
- 📈 更强的成就感

**潜在风险：**
- ⚠️ 可能增加用户挫败感
- ⚠️ 移动端电池消耗
- ⚠️ 新手可能觉得太难

## 推荐实施方案

### 短期 (1-2周)
**保持每日一词，但增加挑战模式：**
1. 添加"无限模式" - 连续猜测无限单词
2. 添加"计时挑战" - 尽快猜完今日单词
3. 添加"最少路径挑战" - 用最少字母完成

**代码示例：**
```typescript
// 在 usePathWordle.ts 中添加
interface GameModes {
  daily: { targetWord: string; maxAttempts: 6 };
  practice: { targetWord: string; maxAttempts: 6 };
  timed: { targetWord: string; timeLimit: 60 };
  endless: { targetWord: string; maxAttempts: Infinity };
}
```

### 中期 (1-2个月)
**添加"每日5词挑战"作为额外模式：**
- 保持原有的每日一词模式
- 新增"马拉松模式"：连续猜5个词
- 用户可以选择想要挑战的模式

**UI布局：**
```
┌─────────────────────────────┐
│  Daily Challenge Mode        │
│  ┌─────────────────────┐   │
│  │  Word 1 of 5         │   │
│  │  [C][L][E][A][R]   │   │
│  │  ✓ Completed!       │   │
│  └─────────────────────┘   │
│  [Continue to Word 2]      │
└─────────────────────────────┘
```

### 长期 (3-6个月)
**完全的5词生态系统：**
- 每周主题周（如"元音周"、"辅音周"）
- 季度奖励系统
- 全球排行榜
- 成就系统
- 多人竞赛模式

## A/B测试计划

### 测试A: 每日一词 vs 每日5词
**变量：**
- 用户参与度
- 日留存率
- 社交分享次数
- 平均游戏时长

**指标：**
```
预期结果：
- 每日5词模式的日留存率 +40%
- 每日5词模式的平均停留时间 +250%
- 每日5词模式的社交分享 +80%
```

## 技术实现建议

### 数据结构设计
```typescript
interface Daily5ChallengeState {
  date: string; // "2024-01-15"
  words: {
    word1: { target: "CLEAN"; attempts: 3; result: "won" };
    word2: { target: "BREAK"; attempts: 5; result: "won" };
    word3: { target: "STEAK"; attempts: 2; result: "won" };
    word4: { target: "BOARD"; attempts: 6; result: "lost" };
    word5: { target: "CRISP"; attempts: 0; result: "pending" };
  };
  totalAttemptsUsed: number;
  overallStatus: 'in-progress' | 'completed' | 'failed';
  completionTime: number; // seconds
}
```

### API端点设计
```typescript
// 获取今日5词挑战
GET /api/daily-challenge/5-words

// 提交单个单词猜测
POST /api/daily-challenge/word/:wordIndex/guess
Body: { path: Array<{row, col}> }

// 获取今日挑战进度
GET /api/daily-challenge/progress

// 获取全球排行榜
GET /api/leaderboard/daily-5-words
```

## 最终建议

### 立即执行 (本周)
1. ✅ 保持当前每日一词模式
2. ✅ 优化hint功能
3. ✅ 修复用户参与钩子
4. ✅ 改进SEO

### 下一步 (本月)
5. 📋 添加"无限模式"选项
6. 📋 创建"每日5词挑战"Beta版
7. 📋 A/B测试用户接受度
8. 📋 收集用户反馈

### 取决于测试结果
- 如果用户喜欢5词模式 → 全面推广
- 如果用户觉得太难 → 保持作为可选挑战
- 如果用户积极参与 → 开发更多模式

## 成功指标

### 关键指标 (KPIs)
- **日留存率**: 目标 >40%
- **平均游戏时长**: 目标 3-5分钟
- **完成率**: 目标 >60%
- **分享率**: 目标 >15%

### 监控方法
```typescript
// Google Analytics 4事件追踪
gtag('event', 'challenge_mode_select', {
  mode: 'single_word' | 'daily_5_words',
  user_segment: 'new' | 'returning'
});

gtag('event', 'challenge_complete', {
  mode: 'single_word' | 'daily_5_words',
  result: 'success' | 'partial' | 'failed',
  time_spent: number
});
```

## 结论

**当前游戏设计（每日一词）是正确的起点。**

**建议：**
1. 短期：保持当前设计，优化用户体验
2. 中期：添加可选的"马拉松模式"
3. 长期：基于用户反馈决定是否全面推广5词模式

**核心原则：** 不要牺牲简单性来增加复杂性。保持游戏易于上手，难于精通。
