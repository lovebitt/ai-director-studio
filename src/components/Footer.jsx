import { Github, Twitter, Mail, Heart } from '../components/SimpleIcons';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* 品牌信息 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-rough-blue to-misty-purple rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">🎬</span>
              </div>
              <div>
                <div className="text-xl font-display font-bold">AI导演工作室</div>
                <div className="text-sm text-white/60">粗粝细腻主义创作</div>
              </div>
            </div>
            <p className="text-white/70 text-sm">
              探索视觉与AI的边界，创作属于这个时代的数字艺术。
              粗犷轮廓与细腻细节的完美融合。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio" className="text-white/70 hover:text-white transition-colors">
                  作品展示
                </Link>
              </li>
              <li>
                <Link href="/agents" className="text-white/70 hover:text-white transition-colors">
                  智能体系统
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-white/70 hover:text-white transition-colors">
                  创作工具
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/70 hover:text-white transition-colors">
                  技术博客
                </Link>
              </li>
            </ul>
          </div>

          {/* 技术栈 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">技术栈</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Next.js + React</li>
              <li>• 即梦AI生成</li>
              <li>• 多智能体系统</li>
              <li>• Tailwind CSS</li>
              <li>• OpenClaw集成</li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">保持联系</h3>
            <p className="text-white/70 text-sm mb-4">
              对AI创作感兴趣？想要合作或咨询？
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@ai-director.studio"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © {currentYear} AI导演工作室. 保留所有权利.
            </div>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="/privacy" className="hover:text-white transition-colors">
                隐私政策
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                使用条款
              </Link>
              <div className="flex items-center gap-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400" />
                <span>by AI导演</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}