/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 粗粝细腻主义色彩方案
        'rough-blue': '#8DA9C4',      // 明亮灰蓝
        'misty-purple': '#B8A9C9',    // 雾霾紫
        'sage-green': '#C5D5C5',      // 鼠尾草绿
        'dusty-pink': '#E8B4BC',      // Dusty Pink
        'sky-blue': '#A3D5FF',        // 天空蓝
        'coral-pink': '#FFB6C1',      // 珊瑚粉
        'paper-white': '#F8F5F0',     // 纸张白
        'charcoal': '#36454F',        // 炭笔黑
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'body': ['"Inter"', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper.jpg')",
        'grain-texture': "url('/textures/grain.png')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      },
    },
  },
  plugins: [],
}