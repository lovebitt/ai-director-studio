import { motion } from 'framer-motion';
import { Sparkles, Palette, Cpu } from 'lucide-react';

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* 主标题 */}
          <h1 className="title-rough mb-6">
            <span className="block">AI导演工作室</span>
            <span className="text-misty-purple">粗粝细腻主义</span>
          </h1>
          
          {/* 副标题 */}
          <p className="text-xl md:text-2xl text-charcoal/80 mb-8 max-w-3xl mx-auto">
            探索视觉与AI的边界，创作属于这个时代的数字艺术。
            粗犷轮廓与细腻细节的完美融合，即梦AI与多智能体的协同创作。
          </p>
          
          {/* 特色标签 */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
              <Palette className="w-5 h-5 text-rough-blue" />
              <span className="font-medium">粗粝细腻主义</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
              <Sparkles className="w-5 h-5 text-misty-purple" />
              <span className="font-medium">即梦AI生成</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow-sm">
              <Cpu className="w-5 h-5 text-sage-green" />
              <span className="font-medium">多智能体系统</span>
            </div>
          </div>
          
          {/* 行动按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
            >
              探索作品集
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              了解创作过程
            </motion.button>
          </div>
        </motion.div>
        
        {/* 滚动提示 */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-charcoal/60 text-sm">向下滚动探索</div>
          <div className="w-6 h-10 border-2 border-charcoal/30 rounded-full mx-auto mt-2 relative">
            <div className="w-1 h-3 bg-charcoal/50 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}