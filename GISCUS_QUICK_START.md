# ⚡ Giscus 评论系统 - 快速配置指南

## 🎯 5分钟快速配置

### 前置条件检查 ✅

**1. GitHub仓库必须公开**
- 访问 https://github.com/Haluntech/pathwordle/settings
- 滚动到"Danger Zone"
- 点击"Change repository visibility"
- 选择"Public"
- 确认更改

**2. 启用Discussions**
- 在同一页面（Settings）
- 滚动到"Features"部分
- 勾选"Discussions"
- 如果未启用，点击"Set up discussions"

**3. 安装Giscus App**
- 访问 https://github.com/apps/giscus
- 点击"Install"
- 选择"All repositories"或仅"pathwordle"
- 点击"Install"

---

## 📝 获取配置参数（2分钟）

### 步骤1：访问Giscus配置页面
打开浏览器访问：https://giscus.app

### 步骤2：配置参数

**基本配置：**
1. **仓库** → `Haluntech/pathwordle`（应该自动显示）
2. **页面 ↔️ discussions 映射关系**
   - 选择：`pathname`（推荐）
3. **Discussion 分类**
   - 选择：`Announcements`
   - 这会在您的仓库创建"Announcements"分类

**外观配置：**
4. **主题** → `dark_dimmed`（匹配深色主题）
5. **语言** → `Automatic`（自动检测）
6. **懒加载** → ✅ 勾选（性能优化）

### 步骤3：复制配置数据
点击"启用"或"Enable"按钮，会看到以下信息：

```html
<script src="https://giscus.app/client.js"
        data-repo="Haluntech/pathwordle"
        data-repo-id="R_kgDOJxxxxxxxx"     ← 保存这个！
        data-category="Announcements"
        data-category-id="DIC_kwDOJxxxxxxxx" ← 保存这个！
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

**📋 重要：保存这两个参数：**
- `data-repo-id`: `R_kgDOJxxxxxxxx`（示例）
- `data-category-id`: `DIC_kwDOJxxxxxxxx`（示例）

---

## 🔧 集成到PathWordle（1分钟）

### 方法A：使用已有组件（推荐）

打开 `src/components/GiscusComments.tsx`，更新参数：

```typescript
const repoId = "R_kgDOJxxxxxxxx"; // 替换为你的实际repo-id
const categoryId = "DIC_kwDOJxxxxxxxx"; // 替换为你的实际category-id
```

**保存文件，完成！**

### 方法B：在LandingPage中添加

在 `LandingPage.tsx` 的评论部分添加：

```tsx
import GiscusComments from './GiscusComments';

// 在final CTA section之后添加：
<section className="mt-16 max-w-4xl mx-auto">
  <h2 className="font-headline font-bold text-3xl text-on-surface mb-8 text-center">
    Community Discussion
  </h2>
  <p className="text-center text-on-surface-variant mb-8">
    Share your thoughts, strategies, and feedback with other players!
  </p>
  <GiscusComments />
</section>
```

---

## ✅ 测试配置（1分钟）

### 测试步骤：

1. **本地测试**
   ```bash
   npm run dev
   ```
   - 访问 http://localhost:5173/
   - 滚动到评论部分
   - 应该看到"Sign in with GitHub"按钮

2. **首次评论**
   - 点击"Sign in with GitHub"
   - 授权Giscus应用
   - 发表第一条评论

3. **验证Discussions**
   - 访问 https://github.com/Haluntech/pathwordle/discussions
   - 应该看到自动创建的讨论

---

## 🎨 自定义选项

### 主题选择

根据您的需求选择：

| 主题 | 适用场景 |
|------|----------|
| `dark_dimmed` | ✅ 推荐（匹配PathWordle深色主题）|
| `dark_high_contrast` | 高对比度（可访问性）|
| `dark_tritan` | 色盲友好 |
| `transparent_dark` | 自定义背景 |

**修改方法：**
在 `GiscusComments.tsx` 中更改 `theme` 参数。

### 语言设置

```javascript
data-lang="zh-CN"  // 简体中文
data-lang="en"     // English
data-lang="ja"     // 日本語
data-lang="ko"     // 한국어
data-lang="es"     // Español
data-lang="fr"     // Français
data-lang="de"     // Deutsch
```

### 评论框位置

```javascript
data-input-position="top"     // 顶部
data-input-position="bottom"  // 底部（默认）
```

---

## 🐛 常见问题解决

### Q1: 评论不显示？
**A:** 检查清单：
1. GitHub仓库是否公开？
2. Discussions是否启用？
3. Giscus App是否安装？
4. `repo-id`和`category-id`是否正确？

### Q2: 显示"Discussion not found"？
**A:** 
- 首次需要触发讨论创建
- 尝试发表第一条评论
- 或手动在GitHub创建Announcement

### Q3: 评论样式错乱？
**A:**
- 检查容器宽度（最小300px）
- 确认主题已加载
- 清除浏览器缓存

### Q4: 每个页面显示相同评论？
**A:**
- 检查 `data-mapping="pathname"` 配置
- 不同URL应有不同讨论

---

## 🚀 部署后检查清单

- [ ] 已更新GiscusComments.tsx参数
- [ ] 已推送到GitHub
- [ ] Vercel已部署
- [ ] 访问网站确认评论显示
- [ ] 测试首次评论功能
- [ ] 验证GitHub Discussions同步

---

## 📞 需要帮助？

**配置困难？**
- 查看[完整指南](./GISCUS_SETUP.md)
- 访问 https://giscus.app
- 检查：https://github.com/giscus/giscus-component/issues

**配置成功后：**
- 🎉 恭喜！您的网站现在有评论系统了
- 💬 用户可以用GitHub账号登录
- 📝 支持Markdown和代码高亮
- 🌍 自动检测用户语言

---

**⏰ 预计配置时间：5-10分钟**

**🎯 难度级别：⭐⭐☆☆☆（简单）**

**现在就开始配置，为您的PathWordle添加社区互动功能！** 🚀
