#!/bin/bash

# Vercel构建修复脚本
echo "🔧 修复Vercel构建配置..."

# 清理可能的缓存
echo "🧹 清理缓存..."
rm -rf node_modules package-lock.json .next

# 使用兼容性更好的npm配置重新安装
echo "📦 重新安装依赖..."
npm cache clean --force
npm install --legacy-peer-deps --no-audit --no-fund

# 测试构建
echo "🏗️ 测试构建..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 构建测试成功！"
    echo ""
    echo "🚀 修复完成，现在可以："
    echo "1. 提交这些修复文件："
    echo "   - package.json (已更新engines字段)"
    echo "   - vercel.json (Vercel配置)"
    echo "   - .npmrc (npm配置)"
    echo "   - fix-vercel-build.sh (修复脚本)"
    echo ""
    echo "2. 推送到GitHub："
    echo "   git add ."
    echo "   git commit -m '🔧 修复Vercel构建配置'"
    echo "   git push origin main"
    echo ""
    echo "3. Vercel会自动重新部署"
else
    echo "❌ 构建测试失败，需要进一步调试"
    exit 1
fi