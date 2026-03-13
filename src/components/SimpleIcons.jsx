// 简单的图标组件，替代lucide-react
// 使用简单的SVG图标或文本图标

export const Github = () => <span>🐙</span>;
export const Twitter = () => <span>🐦</span>;
export const Mail = () => <span>📧</span>;
export const Heart = () => <span>❤️</span>;
export const Palette = () => <span>🎨</span>;
export const Cpu = () => <span>💻</span>;
export const Users = () => <span>👥</span>;
export const CheckCircle = () => <span>✅</span>;
export const Clock = () => <span>⏰</span>;
export const Zap = () => <span>⚡</span>;
export const Menu = () => <span>☰</span>;
export const X = () => <span>✕</span>;
export const Sparkles = () => <span>✨</span>;
export const AlertCircle = () => <span>⚠️</span>;
export const Play = () => <span>▶️</span>;
export const Pause = () => <span>⏸️</span>;
export const Trash2 = () => <span>🗑️</span>;
export const Plus = () => <span>➕</span>;
export const Filter = () => <span>🔍</span>;
export const Send = () => <span>📤</span>;
export const Paperclip = () => <span>📎</span>;
export const Image = () => <span>🖼️</span>;
export const ImageIcon = () => <span>🖼️</span>;
export const FileText = () => <span>📄</span>;
export const Smile = () => <span>😊</span>;
export const Bot = () => <span>🤖</span>;
export const User = () => <span>👤</span>;
export const Activity = () => <span>📈</span>;
export const TrendingUp = () => <span>📊</span>;
export const AlertTriangle = () => <span>🚨</span>;
export const RefreshCw = () => <span>🔄</span>;
export const BarChart3 = () => <span>📊</span>;
export const Target = () => <span>🎯</span>;
export const MessageSquare = () => <span>💬</span>;
export const FileTextIcon = () => <span>📝</span>;
export const Bell = () => <span>🔔</span>;
export const Settings = () => <span>⚙️</span>;
export const HelpCircle = () => <span>❓</span>;

// framer-motion替代
export const motion = {
  div: ({ children, ...props }) => <div {...props}>{children}</div>,
  section: ({ children, ...props }) => <section {...props}>{children}</section>
};