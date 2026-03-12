# 🚀 手动推送代码到GitHub

## 当前状态
代码已准备就绪，位于：
```
/root/.openclaw/workspace/website/
```

## 推送步骤

### 方法A：使用GitHub Token（推荐）

#### 1. 生成GitHub Personal Access Token
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token"
3. 选择 "classic" token
4. 设置权限：至少需要 "repo" 权限
5. 生成Token并复制（保存好，只显示一次）

#### 2. 推送代码
在终端执行：
```bash
# 进入网站目录
cd /root/.openclaw/workspace/website

# 设置远程仓库（替换 YOUR_TOKEN 为你的Token）
git remote set-url origin https://lovebitt:YOUR_TOKEN@github.com/lovebitt/ai-director-studio.git

# 推送代码
git push -u origin main
```

### 方法B：使用SSH密钥

#### 1. 生成SSH密钥（如果没有）
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

#### 2. 添加公钥到GitHub
1. 复制公钥：`cat ~/.ssh/id_ed25519.pub`
2. 访问 https://github.com/settings/keys
3. 点击 "New SSH key"
4. 粘贴公钥

#### 3. 推送代码
```bash
cd /root/.openclaw/workspace/website
git remote set-url origin git@github.com:lovebitt/ai-director-studio.git
git push -u origin main
```

### 方法C：使用GitHub CLI（最简单）

#### 1. 安装GitHub CLI
```bash
# Ubuntu/Debian
sudo apt install gh

# macOS
brew install gh
```

#### 2. 登录GitHub
```bash
gh auth login
```

#### 3. 推送代码
```bash
cd /root/.openclaw/workspace/website
git push -u origin main
```

## 代码内容概览

### 项目结构
```
website/
├── src/pages/index.jsx          # 首页
├── src/components/              # React组件
│   ├── HeroSection.jsx         # 英雄区域
│   ├── AgentStatus.jsx         # 智能体状态
│   ├── Navbar.jsx              # 导航栏
│   └── Footer.jsx              # 页脚
├── src/styles/globals.css      # 全局样式
├── package.json                # 依赖配置
├── tailwind.config.js          # Tailwind配置
├── next.config.js              # Next.js配置
├── DEPLOY-GUIDE.md             # 部署指南
├── MANUAL-PUSH.md              # 本文档
└── .gitignore                  # Git忽略配置
```

### 网站功能
1. **响应式设计**：桌面/平板/手机全适配
2. **智能体状态展示**：实时工作进度可视化
3. **粗粝细腻主义**：独特的视觉风格
4. **完整导航系统**：桌面 + 移动端

## Vercel部署

### 推送成功后
1. 访问 https://vercel.com/new
2. 导入仓库 `ai-director-studio`
3. 点击 "Deploy"
4. 等待2-3分钟构建

### 访问地址
部署完成后，访问：
```
https://ai-director-studio.vercel.app
```

## 故障排除

### 常见问题1：认证失败
**错误**：`fatal: Authentication failed`
**解决**：
1. 确认Token或密码正确
2. 重新生成Token
3. 使用SSH方式

### 常见问题2：仓库不存在
**错误**：`repository not found`
**解决**：
1. 确认仓库URL正确
2. 确认有仓库访问权限
3. 确认仓库已创建

### 常见问题3：权限不足
**错误**：`permission denied`
**解决**：
1. 确认Token有"repo"权限
2. 确认SSH密钥已添加到GitHub
3. 确认是仓库所有者或有推送权限

## 立即行动

### 推荐步骤
1. **生成GitHub Token**（5分钟）
2. **推送代码**（2分钟）
3. **Vercel部署**（3分钟）
4. **测试网站**（2分钟）

**总时间**：约12分钟

### 成功标志
1. ✅ GitHub仓库显示代码文件
2. ✅ Vercel部署成功
3. ✅ 网站正常访问
4. ✅ 所有功能正常工作

## 获取帮助

如果遇到问题：
1. **查看GitHub文档**：https://docs.github.com
2. **查看Vercel文档**：https://vercel.com/docs
3. **查看Next.js文档**：https://nextjs.org/docs

---
*最后更新：2026-03-12*