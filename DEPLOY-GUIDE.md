# 🚀 AI导演工作室网站 - Vercel部署指南

## 📋 部署前准备

### 1. GitHub账户
- 如果没有GitHub账户，请先注册：https://github.com
- 登录GitHub账户

### 2. Vercel账户  
- 访问 https://vercel.com
- 使用GitHub账户登录（推荐）
- 或创建新账户

## 🎯 部署步骤

### 步骤1：创建GitHub仓库
1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `ai-director-studio` (或你喜欢的名字)
   - **Description**: AI导演工作室 - 粗粝细腻主义创作网站
   - **Public** (选择公开仓库)
   - 不初始化README.md (我们已有代码)

3. 点击 "Create repository"

### 步骤2：推送代码到GitHub
在终端执行以下命令：

```bash
# 进入网站目录
cd /root/.openclaw/workspace/website

# 添加远程仓库（替换 YOUR_USERNAME 为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/ai-director-studio.git

# 推送代码
git push -u origin main
```

**需要输入GitHub用户名和密码/Token**

### 步骤3：Vercel部署
1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择你刚创建的 `ai-director-studio` 仓库
4. 点击 "Import"

### 步骤4：配置部署
Vercel会自动检测Next.js项目：
- **Framework Preset**: Next.js (自动检测)
- **Build Command**: `npm run build` (自动)
- **Output Directory**: `.next` (自动)
- **Install Command**: `npm install` (自动)

点击 "Deploy"

## ⏱️ 部署时间
- **构建时间**: 2-3分钟
- **部署时间**: 1-2分钟  
- **总时间**: 约5分钟

## 🌐 访问地址
部署完成后，你将获得：
- **默认地址**: `https://ai-director-studio.vercel.app`
- **自定义域名**: 可绑定自己的域名

## ✅ 验证部署
访问你的Vercel地址，检查：
1. ✅ 网站正常加载
2. ✅ 响应式设计工作
3. ✅ 智能体状态显示
4. ✅ 所有功能正常

## 🔧 故障排除

### 常见问题1：构建失败
**症状**: Vercel构建失败，显示错误日志
**解决方案**:
```bash
# 本地测试构建
cd /root/.openclaw/workspace/website
npm run build

# 如果本地构建成功，但Vercel失败
# 可能是环境变量或Node版本问题
```

### 常见问题2：样式丢失
**症状**: 网站加载但没有样式
**解决方案**:
1. 检查 `tailwind.config.js` 配置
2. 确保 `globals.css` 正确导入
3. 重新部署

### 常见问题3：图片不显示
**症状**: 图片占位符但无实际图片
**解决方案**:
1. 检查 `next.config.js` 中的图片配置
2. 确保图片路径正确
3. 使用绝对路径而非相对路径

## 🔄 更新网站
当你修改代码后，只需：
```bash
# 提交更改
git add .
git commit -m "更新描述"

# 推送到GitHub
git push origin main
```
Vercel会自动检测并重新部署！

## 📱 移动端测试
部署后，请在手机上测试：
1. 打开手机浏览器
2. 访问你的Vercel地址
3. 检查响应式布局
4. 测试触摸交互

## 🎨 自定义配置

### 修改网站信息
编辑以下文件自定义：
- `src/pages/index.jsx` - 首页内容
- `src/components/` - 各个组件
- `tailwind.config.js` - 颜色和主题

### 添加新页面
1. 在 `src/pages/` 创建新页面文件
2. 在 `src/components/Navbar.jsx` 添加导航链接
3. 推送更新

### 修改智能体数据
编辑 `src/components/AgentStatus.jsx` 中的 `agents` 数组：
```javascript
const agents = [
  {
    id: 'visual',
    name: '视觉风格智能体',
    status: 'working',
    progress: 50,
    // ... 其他属性
  },
  // ... 其他智能体
];
```

## 🔐 环境变量（如果需要）
如果未来需要API密钥等敏感信息：
1. 在Vercel项目设置中添加环境变量
2. 在代码中通过 `process.env.VARIABLE_NAME` 访问
3. 不要将敏感信息提交到GitHub

## 📊 监控和分析
Vercel提供：
- **访问统计**: 查看网站流量
- **性能监控**: 加载速度和错误率
- **部署历史**: 所有部署记录
- **域名管理**: 自定义域名配置

## 🆘 获取帮助
如果遇到问题：
1. **检查Vercel部署日志**
2. **本地测试** `npm run build` 和 `npm run dev`
3. **查看Next.js文档**: https://nextjs.org/docs
4. **查看Vercel文档**: https://vercel.com/docs

## 🎉 部署成功标志
1. ✅ Vercel显示 "Deployment Successful"
2. ✅ 可以访问 `https://你的项目.vercel.app`
3. ✅ 网站功能完整，样式正常
4. ✅ 移动端响应式工作正常

---
*部署指南版本: v1.0 | 最后更新: 2026-03-12*