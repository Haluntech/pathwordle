# 如何在PathWordle中集成GA4事件跟踪

## 🚀 快速开始

### 第1步：初始化Analytics（已完成 ✅）

在 `index.html` 中，GA4代码已添加。

### 第2步：在组件中导入Analytics工具

```typescript
import analytics from '../utils/analytics';
```

### 第3步：初始化Analytics（在App.tsx或主组件中）

```typescript
useEffect(() => {
  analytics.initAnalytics();
}, []);
```

---

## 📝 实际使用示例

### 示例1：跟踪游戏开始

在 `PathWordle.tsx` 中：

```typescript
useEffect(() => {
  // 当游戏模式改变时跟踪
  analytics.trackGameStart(gameMode);
}, [gameMode]);
```

### 示例2：跟踪游戏完成

在 `handleSubmit` 函数中，当游戏结束时：

```typescript
const handleSubmit = useCallback(() => {
  // ... 游戏逻辑 ...
  
  if (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost') {
    const timeTaken = Math.round((Date.now() - gameStartTime) / 1000);
    const attemptsUsed = 6 - gameState.attemptsLeft;
    
    analytics.trackGameComplete(
      gameState.gameStatus === 'won' ? 'won' : 'lost',
      attemptsUsed,
      6,
      timeTaken,
      gameMode,
      gameState.targetWord
    );
    
    // 记录到统计中
    recordGame(gameState.gameStatus === 'won', attemptsUsed, timeTaken);
  }
}, [gameState, gameStartTime, recordGame, gameMode]);
```

### 示例3：跟踪提示使用

在 `OptimizedHintPanel.tsx` 中：

```typescript
const handleHintClick = (hintId: string) => {
  setSelectedHint(hintId);
  onUseHint(hintId);
  
  // 跟踪提示使用
  analytics.trackHintUsed(
    hintId as any, // hintType
    attemptsLeft,
    'daily' // 或从props获取
  );
  
  setTimeout(() => {
    setSelectedHint(null);
  }, 3000);
};
```

### 示例4：跟踪社交分享

在 `ShareSystem.tsx` 中：

```typescript
const handleShare = (platform: SharePlatform) => {
  analytics.trackShare(
    platform,
    gameResult.won ? 'won' : 'lost',
    gameResult.attemptsUsed
  );
  
  // ... 分享逻辑 ...
};
```

### 示例5：跟踪模态框视图

```typescript
// 打开统计模态框
const handleShowStatistics = () => {
  setShowStatistics(true);
  analytics.trackPageView('Statistics');
};

// 打开帮助模态框
const handleShowHowToPlay = () => {
  setShowHowToPlay(true);
  analytics.trackPageView('How to Play');
};
```

### 示例6：跟踪主题切换

```typescript
const handleToggleTheme = useCallback(() => {
  setIsDarkMode(prev => {
    const newValue = !prev;
    
    // 跟踪主题变化
    analytics.trackThemeChange(newValue ? 'dark' : 'light');
    
    if (newValue) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '#0e0e0f';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.backgroundColor = '#ffffff';
    }
    return newValue;
  });
}, []);
```

### 示例7：跟踪游戏模式切换

```typescript
const handleModeChange = (newMode: 'daily' | 'practice') => {
  analytics.trackModeSwitch(gameMode, newMode);
  setGameMode(newMode);
  if (onModeChange) {
    onModeChange(newMode);
  }
};
```

### 示例8：跟踪成就解锁

在 `AchievementNotification` 中：

```typescript
useEffect(() => {
  if (achievement) {
    analytics.trackAchievement(
      achievement.id,
      achievement.title
    );
  }
}, [achievement]);
```

---

## 📊 在PathWordle.tsx中完整集成

在 `PathWordle.tsx` 顶部添加导入：

```typescript
import analytics from '../utils/analytics';
```

然后在组件中添加这些效果：

```typescript
// 在PathWordle组件内
useEffect(() => {
  // 初始化analytics
  analytics.initAnalytics();
}, []);

// 跟踪游戏模式变化
useEffect(() => {
  analytics.trackGameStart(gameMode);
}, [gameMode]);

// 跟踪模态框视图
useEffect(() => {
  if (showStatistics) {
    analytics.trackPageView('Statistics');
  }
}, [showStatistics]);

useEffect(() => {
  if (showHowToPlay) {
    analytics.trackPageView('How to Play');
  }
}, [showHowToPlay]);
```

在 `handleSubmit` 中添加：

```typescript
// 当游戏完成时
analytics.trackGameComplete(
  gameState.gameStatus === 'won' ? 'won' : 'lost',
  6 - gameState.attemptsLeft,
  6,
  Math.round((Date.now() - gameStartTime) / 1000),
  gameMode,
  gameState.targetWord
);
```

---

## 🎯 推荐实现优先级

### 优先级1（立即实现）：
1. ✅ 游戏开始跟踪 (`trackGameStart`)
2. ✅ 游戏完成跟踪 (`trackGameComplete`)
3. ✅ 社交分享跟踪 (`trackShare`)

### 优先级2（本周实现）：
4. 提示使用跟踪 (`trackHintUsed`)
5. 模态框视图跟踪 (`trackPageView`)
6. 主题切换跟踪 (`trackThemeChange`)

### 优先级3（下周实现）：
7. 游戏模式切换 (`trackModeSwitch`)
8. 成就解锁 (`trackAchievement`)
9. 错误跟踪 (`trackError`)

---

## 🔍 测试Analytics

### 测试步骤：

1. **打开实时报告**
   - 访问 https://analytics.google.com/
   - 进入"实时"报告

2. **触发事件**
   - 在你的游戏中完成一局游戏
   - 点击分享按钮
   - 打开统计面板

3. **验证事件**
   - 检查事件是否出现在实时报告中
   - 查看事件参数是否正确

### 使用DebugView（Chrome扩展）：

1. 安装 [Google Analytics Debugger](https://chrome.google.com/webstore/detail/jnkmfdileelhofjcijamephohjechhna)
2. 启用DebugView
3. 在开发者工具Console中查看事件

---

## 📈 验证数据

### 检查清单：
- [ ] 游戏开始事件正确记录
- [ ] 游戏完成事件包含正确参数
- [ ] 社交分享事件触发
- [ ] 模态框视图被记录
- [ ] 所有事件包含timestamp

### 常见问题：

**Q: 事件没有出现在GA4中**
- A: 检查Measurement ID是否正确 (`G-FHENCTMKTY`)
- A: 确保没有ad blocker
- A: 等待5-10分钟（有时有延迟）

**Q: 参数缺失**
- A: 确保所有必需参数都传递了
- A: 检查控制台是否有错误

**Q: 重复事件**
- A: 确保事件只在需要时触发一次
- A: 使用useEffect的依赖数组防止重复

---

## 🎨 自定义事件

如果需要跟踪特定事件：

```typescript
// 示例：跟踪特殊功能使用
analytics.trackEngagement('special_feature', 'power_up', {
  level: 3,
  success: true
});

// 示例：跟踪错误
analytics.trackError('grid_error', 'Cell selection failed', {
  row: 3,
  col: 4,
  currentPath: currentWord
});
```

---

## 📞 获取帮助

如果遇到问题：
1. 检查 `analytics.ts` 文件是否存在
2. 验证GA4 Measurement ID: `G-FHENCTMKTY`
3. 查看浏览器Console的错误
4. 参考 [GA4文档](https://support.google.com/analytics)

---

**创建日期：** 2026年3月27日
**Measurement ID：** G-FHENCTMKTY
**状态：** ✅ 已配置并可以使用
