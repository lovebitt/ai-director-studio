import Head from 'next/head';
import HeroSection from '@/components/HeroSection';
import AgentStatus from '@/components/AgentStatus';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>AI导演工作室 - 粗粝细腻主义创作</title>
        <meta name="description" content="探索视觉与AI的边界，创作属于这个时代的数字艺术。粗犷轮廓与细腻细节的完美融合，即梦AI与多智能体的协同创作。" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* 字体预加载 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono&display=swap" rel="stylesheet" />
      </Head>
      
      <Navbar />
      
      <main>
        <HeroSection />
        <AgentStatus />
        
        {/* 作品展示部分 */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="title-rough mb-4">精选作品</h2>
              <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
                探索粗粝细腻主义风格在不同主题和场景下的应用，每件作品都是AI与人类创意的结晶。
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* 作品卡片示例 */}
              {[
                { title: '城市漫游者', style: '线条对比', color: 'rough-blue' },
                { title: '窗前阅读', style: '光影戏剧', color: 'misty-purple' },
                { title: '自然融合', style: '材质表现', color: 'sage-green' },
              ].map((work, index) => (
                <div key={index} className="card-delicate group cursor-pointer">
                  <div className={`h-48 bg-${work.color}/20 rounded-lg mb-4 flex items-center justify-center`}>
                    <div className="text-4xl">🎨</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{work.title}</h3>
                  <p className="text-charcoal/60 mb-4">粗粝细腻主义 · {work.style}</p>
                  <div className="flex items-center text-sm text-charcoal/50">
                    <span>即梦AI生成</span>
                    <span className="mx-2">•</span>
                    <span>多智能体协作</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* 创作工具部分 */}
        <section className="py-20 bg-gradient-to-br from-rough-blue/5 to-misty-purple/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="title-rough mb-4">创作工具与流程</h2>
              <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
                从概念到成品的完整创作流程，结合即梦AI与多智能体系统的先进工具链。
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '01', title: '概念设计', desc: '视觉风格研究与概念定义' },
                { step: '02', title: '提示词优化', desc: '即梦AI提示词系统化设计' },
                { step: '03', title: '智能体协作', desc: '多智能体并行生成与优化' },
                { step: '04', title: '成果整合', desc: '作品筛选、后期与展示' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-rough-blue mx-auto mb-4 shadow-lg">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-charcoal/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}