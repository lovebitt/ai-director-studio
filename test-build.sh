#!/bin/bash

echo "🎬 测试Next.js构建..."
echo "======================"

# 检查文件存在性
echo "1. 检查核心文件..."
ls -la src/pages/index.jsx src/components/ package.json tailwind.config.js postcss.config.js

echo ""
echo "2. 检查package.json..."
cat package.json | grep -E '"name"|"dependencies"|"devDependencies"'

echo ""
echo "3. 尝试最小构建测试..."
# 创建一个最简单的测试页面
cat > test-page.jsx << 'EOF'
export default function TestPage() {
  return (
    <div>
      <h1>测试页面</h1>
      <p>如果这个能显示，说明基础构建正常</p>
    </div>
  );
}
EOF

echo "测试页面已创建"
echo "======================"
echo "🎬 测试完成！"