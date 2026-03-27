# Giscus 评论系统配置指南

## 什么是 Giscus？

Giscus 是一个基于 GitHub Discussions 的评论系统，为您的网站提供强大的评论功能。

## 如何启用评论功能？

### 1. 准备工作

确保您的 GitHub 仓库满足以下条件：
- 仓库是**公开的**
- 在仓库中启用了 **Discussions** 功能
- 安装了 [Giscus App](https://github.com/apps/giscus)

### 2. 获取配置信息

访问 [Giscus 官网](https://giscus.app) 并按以下步骤操作：

1. 输入您的仓库地址（例如：`username/repository`）
2. 选择页面 ↔️ discussions 映射关系
3. 选择 Discussion 分类
4. 选择主题（建议选择 `dark` 和 `light` 以支持主题切换）
5. 复制生成的 `data-repo-id` 和 `data-category-id`

### 3. 更新代码

在 `src/components/PathWordle.tsx` 中找到以下代码段：

```typescript
// Inject Giscus script dynamically with theme support
useEffect(() => {
  // Only load Giscus if repo is configured
  const repoId = "ENTER_YOUR_REPO_ID_HERE"; // Replace with actual repo ID
  if (repoId === "ENTER_YOUR_REPO_ID_HERE") {
    console.log('Giscus not configured. Add your repository details to enable comments.');
    return;
  }

  const script = document.createElement('script');
  script.src = "https://giscus.app/client.js";
  script.setAttribute("data-repo", "your-username/your-repo"); // Replace with actual repo
  script.setAttribute("data-repo-id", repoId);
  script.setAttribute("data-category", "General");
  script.setAttribute("data-category-id", "ENTER_CATEGORY_ID_HERE"); // Replace with actual category ID
```

替换以下内容：
1. 将 `ENTER_YOUR_REPO_ID_HERE` 替换为您的实际 repo ID
2. 将 `your-username/your-repo` 替换为您的实际仓库名称
3. 将 `ENTER_CATEGORY_ID_HERE` 替换为您的实际 category ID

### 4. 验证配置

保存更改后，刷新页面。如果配置正确，您应该能看到评论框。

### 主题切换

代码已经支持主题切换功能：
- 当用户切换深色/浅色主题时，评论框会自动更新
- `data-theme` 属性会根据 `isDarkMode` 状态动态调整

## 常见问题

### Q: 为什么我看不到评论框？
A: 请检查：
1. 仓库是否公开
2. 是否启用了 Discussions
3. 是否安装了 Giscus App
4. repo ID 和 category ID 是否正确

### Q: 评论框显示但无法发表评论？
A: 确保您：
1. 已登录 GitHub
2. 已授权 Giscus App
3. 仓库权限设置正确

### Q: 如何禁用评论功能？
A: 将 `repoId` 保持为 `"ENTER_YOUR_REPO_ID_HERE"` 即可。

## 更多信息

- [Giscus 官方文档](https://giscus.app)
- [GitHub Discussions 文档](https://docs.github.com/en/discussions)
