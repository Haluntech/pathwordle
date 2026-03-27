#!/bin/bash

echo "🔍 检查GitHub仓库状态..."
echo ""

# Check if repo is accessible
echo "📊 检查仓库可访问性..."
REPO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://api.github.com/repos/Haluntech/pathwordle)

if [ "$REPO_STATUS" = "200" ]; then
    echo "✅ 仓库可访问"
    
    # Get repo details
    echo ""
    echo "📋 仓库详情："
    curl -s https://api.github.com/repos/Haluntech/pathwordle | jq '{
      "名称": .name,
      "可见性": .visibility,
      "私有": .private,
      "语言": .language,
      "Stars": .stargazers_count,
      "Forks": .forks_count
    }' 2>/dev/null || echo "需要jq工具来显示详情"
    
    echo ""
    echo "🔧 Discussions状态："
    HAS_DISCUSSIONS=$(curl -s https://api.github.com/repos/Haluntech/pathwordle | jq '.has_discussions' 2>/dev/null)
    
    if [ "$HAS_DISCUSSIONS" = "true" ]; then
        echo "✅ Discussions已启用"
    else
        echo "⚠️  Discussions未启用"
        echo ""
        echo "📝 启用步骤："
        echo "1. 访问: https://github.com/Haluntech/pathwordle/settings"
        echo "2. 滚动到 'Features' 部分"
        echo "3. 勾选 'Discussions'"
        echo "4. 点击 'Set up discussions'"
        echo "5. 选择 'Q&A' 或 'Announcements'"
        echo "6. 点击 'Complete setup'"
    fi
    
else
    echo "❌ 仓库不可访问或需要认证"
    echo ""
    echo "🔧 解决方案："
    echo "1. 确认仓库名称正确: Haluntech/pathwordle"
    echo "2. 检查您是否登录GitHub"
    echo "3. 确认仓库是公开的"
fi

echo ""
echo "📝 下一步："
echo "1. 如果仓库可见性是Public: ✅ 继续"
echo "2. 如果Discussions已启用: ✅ 访问 https://giscus.app"
echo "3. 如果Discussions未启用: ⚠️ 按照上述步骤启用"
echo ""
echo "🎯 Giscus配置页面: https://giscus.app?repo=Haluntech/pathwordle"
