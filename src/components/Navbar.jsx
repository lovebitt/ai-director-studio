import { useState } from 'react';
import { Menu, X, Palette, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: '首页', href: '/' },
    { label: '作品集', href: '/portfolio' },
    { label: '智能体', href: '/agents' },
    { label: '创作工具', href: '/tools' },
    { label: '关于', href: '/about' },
    { label: '博客', href: '/blog' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-charcoal/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rough-blue to-misty-purple rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-charcoal">
              AI导演
            </span>
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-charcoal/80 hover:text-rough-blue transition-colors font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rough-blue group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
            <button className="btn-primary text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              开始创作
            </button>
          </div>

          {/* 移动菜单按钮 */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-charcoal" />
            ) : (
              <Menu className="w-6 h-6 text-charcoal" />
            )}
          </button>
        </div>

        {/* 移动菜单 */}
        {isOpen && (
          <div className="md:hidden border-t border-charcoal/10 mt-2 pb-4">
            <div className="flex flex-col space-y-3 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-charcoal/80 hover:text-rough-blue transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button className="btn-primary mt-4">
                <Sparkles className="w-4 h-4 mr-2" />
                开始创作
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}