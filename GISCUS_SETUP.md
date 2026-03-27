# Giscus 评论系统配置指南

## 🎯 什么是 Giscus？

Giscus 是一个基于 GitHub Discussions 的评论系统，完全免费、无广告、隐私友好。

## ✅ 优势

- ✅ **完全免费** - 无需付费
- ✅ **无广告** - 干净整洁
- ✅ **隐私友好** - 数据存储在GitHub
- ✅ **支持Markdown** - 富文本编辑
- ✅ **语法高亮** - 代码块着色
- ✅ **响应式设计** - 移动端友好
- ✅ **多语言支持** - 自动检测语言
- ✅ **无需数据库** - 使用GitHub Discussions

## 📋 前置要求

1. **GitHub仓库公开**
   - 仓库必须是公开的（Public）
   - 如果是私有仓库，需要改为公开

2. **启用Discussions**
   - 进入仓库Settings
   - 滚动到"Features"部分
   - 勾选"Discussions"

3. **安装Giscus App**
   - 访问：https://github.com/apps/giscus
   - 点击"Install"
   - 选择您的仓库（PathWordle）
   - 授权安装

## 🚀 快速开始

### 步骤1：获取配置参数

访问 https://giscus.app 获取您的配置：

1. **仓库** → `Haluntech/pathwordle`
2. **页面 ↔️ discussions 映射关系**
   - 选择：`pathname` (推荐)
   - 或：`title` / `og:title`
3. **Discussion 分类**
   - 选择：`Announcements` (公告)
   - 或：`General` (一般)
4. **主题** → 选择一个主题
   - 推荐：`dark_dimmed` (适配深色模式)
5. **语言** → `zh-CN` (中文) 或 `Automatic`
6. **懒加载** → ✅ 勾选

### 步骤2：复制配置代码

点击"启用"按钮，您将看到类似这样的配置：

```html
<script src="https://giscus.app/client.js"
        data-repo="Haluntech/pathwordle"
        data-repo-id="R_kgDOJxxxxxxxx"
        data-category="Announcements"
        data-category-id="DIC_kwDOJxxxxxxxx"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="dark_dimmed"
        data-lang="zh-CN"
        data-loading="lazy"
        crossorigin="anonymous"
        async>
</script>
```

**保存以下重要参数：**
- `data-repo-id` 
- `data-category-id`

### 步骤3：集成到PathWordle

在您的项目中，Giscus已经准备好集成。只需要：

#### 选项A：使用Giscus组件（推荐）

创建 `src/components/GiscusComments.tsx`:

```typescript
import React, { useEffect, useRef } from 'react';

interface GiscusProps {
  repo?: string;
  repoId?: string;
  categoryId?: string;
  theme?: string;
}

const GiscusComments: React.FC<GiscusProps> = ({
  repo = "Haluntech/pathwordle",
  repoId = "R_kgDOJxxxxxxxx", // 替换为您的repo-id
  categoryId = "DIC_kwDOJxxxxxxxx", // 替换为您的category-id
  theme = "dark_dimmed"
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 移除旧脚本
    const existingScript = document.querySelector('#giscus-script');
    if (existingScript) {
      existingScript.remove();
    }

    // 创建新脚本
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', theme);
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    script.setAttribute('async', 'true');
    script.id = 'giscus-script';
    
    if (ref.current) {
      ref.current.appendChild(script);
    }

    return () => {
      script.remove();
    };
  }, [repo, repoId, categoryId, theme]);

  return (
    <div 
      ref={ref} 
      className="giscus-container"
      style={{ minHeight: '200px' }}
    />
  );
};

export default GiscusComments;
```

#### 选项B：使用已有的评论容器

在 `PathWordle.tsx` 中，已经有评论容器：

```tsx
<div id="comments-container" className="max-w-5xl mx-auto w-full px-8 py-8 mt-auto border-t border-surface-container-high">
  <h2 className="text-2xl font-bold text-on-surface mb-8 text-center uppercase tracking-wider font-headline">
    Community Discussion
  </h2>
  <div className="bg-surface-container rounded-xl p-6 sm:p-10 shadow-sm">
    <div id="giscus-container" className="giscus mx-auto">
      {/* Giscus将在这里加载 */}
    </div>
  </div>
</div>
```

只需添加Giscus脚本到 `<head>` 或在组件中动态加载。

## 🎨 主题配置

Giscus支持多种主题，根据您的深色模式选择：

| 主题 | 说明 | 适用场景 |
|------|------|----------|
| `dark_dimmed` | 深色暗淡 | ✅ 推荐（匹配PathWordle） |
| `dark_tritan` | 深色色盲模式 | 色盲友好 |
| `dark_high_contrast` | 深色高对比 | 可访问性 |
| `transparent_dark` | 透明深色 | 自定义背景 |
| `noborder_dark` | 无边框深色 | 极简风格 |

## 🌍 多语言支持

Giscus自动检测语言，也可手动指定：

```javascript
data-lang="zh-CN"  // 简体中文
data-lang="en"     // English
data-lang="ja"     // 日本語
data-lang="ko"     // 한국어
```

## 🔧 高级配置

### 1. 懒加载优化
```javascript
data-loading="lazy"  // 当进入视口时加载
```

### 2. 评论框位置
```javascript
data-input-position="top"     // 顶部
data-input-position="bottom"  // 底部（默认）
```

### 3. 启用反应
```javascript
data-reactions-enabled="1"  // 启用👍🎉等表情反应
```

### 4. 严格模式
```javascript
data-strict="1"  // 标题必须完全匹配才能使用同一讨论
```

## 📊 在哪里显示评论？

### 方案A：在Landing Page底部
适合：收集用户反馈、功能建议

### 方案B：在游戏页面底部
适合：游戏讨论、每日答案交流

### 方案C：创建专门的`/community`页面
适合：独立的社区讨论区

## 🎯 最佳实践

1. **首次评论提示**
   - 添加说明："首次评论需要GitHub登录"

2. **评论礼仪**
   - 在评论区上方添加社区准则

3. **定期互动**
   - 开发者积极回复评论
   - 及时处理问题反馈

4. **突出优质评论**
   - GitHub讨论中置顶有帮助的评论

## 🐛 常见问题

### Q1: 评论不显示？
**A:** 检查：
- GitHub仓库是否公开
- Discussions是否启用
- Giscus App是否安装
- `data-repo-id` 和 `data-category-id` 是否正确

### Q2: 评论样式错乱？
**A:** 检查：
- 主题是否匹配
- CSS是否有冲突
- 容器宽度是否足够（建议最小300px）

### Q3: 每个页面都显示相同评论？
**A:** 检查 `data-mapping` 配置：
- 使用 `pathname` 按URL路径区分
- 使用 `title` 按页面标题区分

## 📱 移动端优化

Giscus原生支持移动端，但可以添加额外优化：

```css
/* 确保评论容器在移动端有足够高度 */
@media (max-width: 768px) {
  .giscus-container {
    min-height: 400px;
  }
}
```

## 🔗 相关链接

- **Giscus官网**: https://giscus.app
- **GitHub仓库**: https://github.com/giscus/giscus-component
- **配置页面**: https://giscus.app/zh-CN (中文版)
- **问题反馈**: https://github.com/giscus/giscus-component/issues

## ✅ 集成检查清单

- [ ] GitHub仓库已公开
- [ ] Discussions已启用
- [ ] Giscus App已安装
- [ ] 已获取 `data-repo-id`
- [ ] 已获取 `data-category-id`
- [ ] 已选择合适的主题
- [ ] 已测试评论功能
- [ ] 移动端显示正常
- [ ] 多语言切换正常

## 🎉 完成后

集成完成后，用户就可以：
1. 使用GitHub账号登录
2. 发表评论
3. 使用表情反应
4. 收到回复通知
5. 订阅讨论更新

**现在就开始配置Giscus，为PathWordle添加社区互动功能吧！** 🚀
