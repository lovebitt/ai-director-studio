# 🎬 AI导演工作室网站

基于"粗粝细腻主义"视觉风格和即梦AI技术的多智能体创作展示网站。

## 🚀 功能特性

### 🎨 视觉设计
- **粗粝细腻主义风格**：粗犷轮廓与细腻细节的视觉语言
- **定制色彩方案**：明亮灰蓝、雾霾紫、鼠尾草绿等主色调
- **质感层次**：纸张纹理、胶片颗粒、刮擦痕迹效果
- **响应式设计**：完美适配桌面、平板、手机设备

### 🤖 智能体集成
- **实时状态展示**：多智能体工作进度可视化
- **任务监控**：智能体当前任务、进度、预计完成时间
- **系统健康**：整体运行状态和性能指标
- **产出展示**：智能体创作成果展示

### 🛠️ 技术特性
- **现代技术栈**：Next.js 14 + React 18 + Tailwind CSS
- **动画交互**：Framer Motion 平滑动画效果
- **性能优化**：代码分割、图片优化、快速加载
- **SEO友好**：服务器端渲染、语义化标签

## 📁 项目结构

```
website/
├── public/                    # 静态资源
│   ├── textures/             # 纹理图片
│   └── favicon.ico
├── src/
│   ├── components/           # React组件
│   │   ├── HeroSection.jsx   # 首页英雄区域
│   │   ├── AgentStatus.jsx   # 智能体状态
│   │   ├── Navbar.jsx        # 导航栏
│   │   └── Footer.jsx        # 页脚
│   ├── pages/               # 页面文件
│   │   ├── index.jsx        # 首页
│   │   ├── _app.jsx         # 应用入口
│   │   └── api/             # API路由
│   └── styles/              # 样式文件
│       └── globals.css      # 全局样式
├── package.json             # 依赖配置
├── tailwind.config.js       # Tailwind配置
├── next.config.js          # Next.js配置
└── README.md               # 本文档
```

## 🚀 快速开始

### 安装依赖
```bash
cd /root/.openclaw/workspace/website
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:3000

### 生产构建
```bash
npm run build
npm start
```

## 🎨 设计系统

### 色彩方案
- `rough-blue` (#8DA9C4) - 明亮灰蓝
- `misty-purple` (#B8A9C9) - 雾霾紫  
- `sage-green` (#C5D5C5) - 鼠尾草绿
- `dusty-pink` (#E8B4BC) - Dusty Pink
- `paper-white` (#F8F5F0) - 纸张白
- `charcoal` (#36454F) - 炭笔黑

### 字体系统
- **标题字体**：Playfair Display (衬线体)
- **正文字体**：Inter (无衬线体)
- **代码字体**：JetBrains Mono (等宽字体)

### 组件样式
- `.card-rough` - 粗粝边框卡片
- `.card-delicate` - 细腻内部卡片
- `.btn-primary` - 主要按钮
- `.btn-secondary` - 次要按钮
- `.title-rough` - 粗粝风格标题
- `.title-delicate` - 细腻风格标题

## 🔗 数据集成

### 智能体状态API
网站可以从以下来源获取实时数据：
1. **OpenClaw协调系统**：`/root/.openclaw/workspace/coordination/`
2. **memsearch索引**：语义搜索智能体产出
3. **即梦AI生成结果**：作品图片和元数据

### 计划中的API端点
```javascript
// 智能体状态API
GET /api/agents/status

// 作品展示API  
GET /api/portfolio

// 创作工具API
GET /api/tools/prompt-generator
```

## 📱 响应式断点
- **手机**：< 640px
- **平板**：640px - 1024px  
- **桌面**：> 1024px

## 🚀 部署选项

### Vercel (推荐)
```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 自托管
```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

## 🔧 开发指南

### 添加新页面
1. 在 `src/pages/` 创建新页面文件
2. 在 `src/components/` 创建相关组件
3. 更新导航栏链接
4. 添加页面样式

### 添加新组件
1. 在 `src/components/` 创建组件文件
2. 导入必要依赖
3. 实现组件逻辑和样式
4. 在页面中使用组件

### 样式定制
1. 修改 `tailwind.config.js` 扩展主题
2. 在 `src/styles/globals.css` 添加自定义样式
3. 使用Tailwind工具类快速开发

## 📈 未来计划

### 短期计划
1. **作品展示页面** - 完整作品集展示
2. **创作工具页面** - 在线提示词生成器
3. **博客系统** - 技术文章和创作心得
4. **用户系统** - 作品收藏和分享

### 长期计划
1. **实时协作** - 多用户协同创作
2. **AI生成工具** - 集成即梦AI API
3. **智能体控制面板** - 实时监控和控制
4. **移动应用** - React Native版本

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License