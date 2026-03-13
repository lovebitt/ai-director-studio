// WebSocket配置
export const socketConfig = {
  // 生产环境URL
  production: {
    url: 'https://lovebitt-ai-director-studio-fv6g.vercel.app',
    path: '/api/socket/io',
    transports: ['websocket', 'polling'],
  },
  // 开发环境URL
  development: {
    url: 'http://localhost:3000',
    path: '/api/socket/io',
    transports: ['websocket', 'polling'],
  },
};

// 获取当前环境配置
export function getSocketConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  return socketConfig[isProduction ? 'production' : 'development'];
}

// 获取WebSocket URL
export function getSocketUrl() {
  const config = getSocketConfig();
  return config.url;
}

// 获取Socket.IO选项
export function getSocketOptions() {
  const config = getSocketConfig();
  return {
    path: config.path,
    transports: config.transports,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  };
}