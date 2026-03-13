import { Sparkles, Palette, Cpu } from '../components/SimpleIcons';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景纹理 */}
      <div className="absolute inset-0 film-grain" />
      <div className="absolute inset-0 bg-gradient-to-br from-rough-blue/10 via-misty-purple/5 to-sage-green/10" />
      
      {/* 粗粝装饰元素 */}
      <div className="absolute top-20 left-10 w-32 h-32 border-5 border-charcoal/20 rotate-12" />
      <div className="absolute bottom-20 right-10 w-48 h-48 border-3 border-dusty-pink/30 -rotate-6" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* 徽章 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/10 backdrop-blur-sm rounded-full mb-8">
            <Sparkles />
            <span className="text-sm font-medium text-charcoal">AI导演工作室</span>
          </div>
          
          {/* 主标题 */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-charcoal">粗粝细腻主义</span>
            <br />
            <span className="text-rough-blue">AI创作新范式</span>
          </h1>
          
          {/* 副标题 */}
          <p className="text-xl md:text-2xl text-charcoal/70 mb-10 max-w-3xl mx-auto">
            融合粗粝质感与细腻情感，探索AI创作的无限可能。
            从概念到成品，智能体协作的全新体验。
          </p>
          
          {/* 特色标签 */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-rough-blue/10 rounded-lg">
              <Palette />
              <span className="font-medium">全风格视觉研究</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-misty-purple/10 rounded-lg">
              <Cpu />
              <span className="font-medium">智能体实时协作</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-sage-green/10 rounded-lg">
              <Sparkles />
              <span className="font-medium">导演思维驱动</span>
            </div>
          </div>
          
          {/* 行动按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/studio" className="btn-primary">
              进入智能工作室
            </a>
            <a href="#process" className="btn-secondary">
              了解创作过程
            </a>
          </div>
        </div>
        
        {/* 滚动提示 */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="text-charcoal/60 text-sm">向下滚动探索</div>
          <div className="w-6 h-10 border-2 border-charcoal/30 rounded-full mx-auto mt-2 relative">
            <div className="w-1 h-3 bg-charcoal/50 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2" />
          </div>
        </div>
      </div>
    </section>
  );
}