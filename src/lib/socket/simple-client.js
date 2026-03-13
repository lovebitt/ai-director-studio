// 极简WebSocket客户端
// 专为解决Vercel连接问题设计

import { io } from 'socket.io-client';

export class SimpleSocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  // 极简连接方法
  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    try {
      console.log('🔌 尝试连接WebSocket...');
      
      // 极简配置 - 只使用必要的参数
      const socketUrl = window.location.origin;
      
      this.socket = io(socketUrl, {
        path: '/api/socket/io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      // 基本事件监听
      this.socket.on('connect', () => {
        console.log('✅ WebSocket连接成功');
        this.isConnected = true;
        this.emit('simple_connection', { status: 'connected' });
      });

      this.socket.on('disconnect', () => {
        console.log('⚠️ WebSocket连接断开');
        this.isConnected = false;
        this.emit('simple_connection', { status: 'disconnected' });
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ WebSocket连接错误:', error.message);
        this.emit('simple_connection', { status: 'error', error: error.message });
      });

      // 监听智能体状态
      this.socket.on('agent_status', (data) => {
        this.emit('agent_status', data);
      });

      this.socket.on('agent_message', (data) => {
        this.emit('agent_message', data);
      });

      return this.socket;

    } catch (error) {
      console.error('❌ 创建WebSocket连接失败:', error);
      this.emit('simple_connection', { status: 'failed', error: error.message });
      return null;
    }
  }

  // 发送消息
  sendMessage(agentId, message, attachments = []) {
    if (!this.socket || !this.isConnected) {
      console.error('无法发送消息: WebSocket未连接');
      return false;
    }

    const messageData = {
      agentId,
      message,
      attachments,
      timestamp: Date.now(),
      userId: 'user_' + Math.random().toString(36).substr(2, 9)
    };

    this.socket.emit('user_message', messageData);
    return true;
  }

  // 事件系统
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`事件 ${event} 回调错误:`, error);
        }
      });
    }
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // 获取连接状态
  getStatus() {
    return {
      connected: this.isConnected,
      socketId: this.socket?.id,
      url: this.socket?.io?.uri
    };
  }
}

// 创建全局单例
let globalSocketClient = null;

export function getSimpleSocketClient() {
  if (!globalSocketClient) {
    globalSocketClient = new SimpleSocketClient();
  }
  return globalSocketClient;
}