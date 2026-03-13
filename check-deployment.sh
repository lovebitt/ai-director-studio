#!/bin/bash

# AI导演智能工作室 - 部署状态检查脚本
# 用于验证Vercel部署状态和功能可用性

echo "🎬 AI导演智能工作室 - 部署状态检查"
echo "======================================"
echo ""

# 检查网站可访问性
echo "🔍 检查网站可访问性..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://lovebitt-ai-director-studio-fv6g.vercel.app/)
if [ "$STATUS_CODE" = "200" ]; then
    echo "✅ 网站可访问 (HTTP $STATUS_CODE)"
else
    echo "❌ 网站不可访问 (HTTP $STATUS_CODE)"
    exit 1
fi

echo ""

# 检查测试页面
echo "🔍 检查测试页面..."
TEST_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://lovebitt-ai-director-studio-fv6g.vercel.app/test-version.html)
if [ "$TEST_STATUS" = "200" ]; then
    echo "✅ 测试页面可访问"
else
    echo "⚠️  测试页面不可访问 (HTTP $TEST_STATUS)"
fi

echo ""

# 检查智能工作室页面
echo "🔍 检查智能工作室页面..."
STUDIO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://lovebitt-ai-director-studio-fv6g.vercel.app/studio)
if [ "$STUDIO_STATUS" = "200" ]; then
    echo "✅ 智能工作室页面可访问"
else
    echo "❌ 智能工作室页面不可访问 (HTTP $STUDIO_STATUS)"
fi

echo ""

# 检查API端点
echo "🔍 检查WebSocket API..."
API_RESPONSE=$(curl -s -I https://lovebitt-ai-director-studio-fv6g.vercel.app/api/socket/io | head -n 1)
if echo "$API_RESPONSE" | grep -q "405"; then
    echo "✅ WebSocket API端点存在 (405 Method Not Allowed - 正常)"
else
    echo "⚠️  WebSocket API端点状态异常: $API_RESPONSE"
fi

echo ""

# 获取部署信息
echo "📊 获取部署信息..."
DEPLOY_TIME=$(curl -s -I https://lovebitt-ai-director-studio-fv6g.vercel.app/ | grep -i "date:" | cut -d' ' -f2-)
if [ -n "$DEPLOY_TIME" ]; then
    echo "🕐 服务器时间: $DEPLOY_TIME"
else
    echo "⚠️  无法获取服务器时间"
fi

echo ""

# 检查页面内容
echo "🔍 检查页面内容..."
PAGE_TITLE=$(curl -s https://lovebitt-ai-director-studio-fv6g.vercel.app/ | grep -o "<title>[^<]*</title>" | sed 's/<title>//;s/<\/title>//')
if [ -n "$PAGE_TITLE" ]; then
    echo "📄 页面标题: $PAGE_TITLE"
else
    echo "⚠️  无法获取页面标题"
fi

echo ""

# 检查GitHub Actions状态 (如果可用)
echo "🔗 检查GitHub仓库状态..."
GIT_STATUS=$(curl -s -I https://github.com/lovebitt/ai-director-studio | head -n 1 | grep -o "200")
if [ "$GIT_STATUS" = "200" ]; then
    echo "✅ GitHub仓库可访问"
else
    echo "⚠️  GitHub仓库访问异常"
fi

echo ""
echo "======================================"
echo "🎬 部署状态检查完成"
echo ""
echo "📋 总结:"
echo "  网站URL: https://lovebitt-ai-director-studio-fv6g.vercel.app"
echo "  智能工作室: https://lovebitt-ai-director-studio-fv6g.vercel.app/studio"
echo "  测试页面: https://lovebitt-ai-director-studio-fv6g.vercel.app/test-version.html"
echo ""
echo "🚀 下一步:"
echo "  1. 访问智能工作室测试实时功能"
echo "  2. 检查WebSocket连接状态"
echo "  3. 验证多智能体协作流程"
echo "  4. 监控系统性能和响应时间"
echo ""
echo "🎯 提示: Vercel通常会在几分钟内自动部署GitHub推送的更新"