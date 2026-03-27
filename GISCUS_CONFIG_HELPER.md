# Giscus 快速配置指南

## 🎯 目标
获取 `repoId` 和 `categoryId` 来启用评论功能

## 📋 步骤 1: 准备 GitHub 仓库
1. 访问你的仓库: https://github.com/Haluntech/pathwordle
2. 点击仓库上方的 **Settings** 标签
3. 向下滚动找到 **Features** 部分
4. 勾选 **Discussions** 复选框
5. 在出现的警告框中点击 **"Enable Discussions"**

## 📋 步骤 2: 安装 Giscus App
1. 访问: https://github.com/apps/giscus
2. 点击 **Install** 按钮
3. 选择 **All repositories** 或只选 **Haluntech/pathwordle**
4. 点击 **Install**

## 📋 步骤 3: 获取配置参数
1. 访问: https://giscus.app/zh-CN
2. 填写表单:
   - 📦 仓库: `Haluntech/pathwordle`
   - 📄 页面 ↔️ discussions 映射关系: `pathname`
   - 📂 Discussion 分类: `Announcements`
   - 🎨 主题: `dark_dimmed`
3. 复制下方的配置:
   - `data-repo-id` (类似: `R_kgDOJxxxxx`)
   - `data-category-id` (类似: `DIC_kwDOJxxxxx`)

## 📋 步骤 4: 更新代码
将获取的两个ID填入 `src/components/PathWordle.tsx` 第402-405行:

```typescript
const script = document.createElement('script');
script.src = "https://giscus.app/client.js";
script.setAttribute("data-repo", "Haluntech/pathwordle");
script.setAttribute("data-repo-id", "你的repo-id"); // 替换这里
script.setAttribute("data-category", "Announcements");
script.setAttribute("data-category-id", "你的category-id"); // 替换这里
```

## ✅ 完成
部署后，评论区就会正常工作！

## 🧪 测试
1. 部署到 Vercel
2. 访问 /game 页面
3. 滚动到底部
4. 应该能看到 GitHub 登录按钮和评论框
