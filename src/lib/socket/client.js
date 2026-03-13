import { io } from 'socket.io-client';
import { getSocketUrl, getSocketOptions } from '../../config/socket';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // 连接到Socket服务器
  connect() {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      return this.socket;
    }

    try {
      // 获取WebSocket配置
      const socketUrl = getSocketUrl();
      const socketOptions = {
        ...getSocketOptions(),
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      };
      
      console.log('Connecting to WebSocket:', socketUrl, socketOptions);
      
      // 创建Socket连接
      this.socket = io(socketUrl, socketOptions);

      // 连接成功
      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connection_established', { socketId: this.socket.id });
      });

      // 连接错误
      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        this.isConnected = false;
        this.emit('connection_error', { error: error.message });
      });

      // 断开连接
      this.socket.on('disconnect', (reason) => {
        console.log('⚠️ Socket disconnected:', reason);
        this.isConnected = false;
        this.emit('connection_lost', { reason });
      });

      // 重新连接
      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Socket reconnected after', attemptNumber, 'attempts');
        this.isConnected = true;
        this.emit('reconnected', { attemptNumber });
      });

      // 重新连接尝试
      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log('Reconnection attempt:', attemptNumber);
        this.reconnectAttempts = attemptNumber;
        this.emit('reconnect_attempt', { attemptNumber });
      });

      // 重新连接错误
      this.socket.on('reconnect_error', (error) => {
        console.error('Reconnection error:', error);
        this.emit('reconnect_error', { error: error.message });
      });

      // 重新连接失败
      this.socket.on('reconnect_failed', () => {
        console.error('Reconnection failed after', this.maxReconnectAttempts, 'attempts');
        this.emit('reconnect_failed');
      });

      // 欢迎消息
      this.socket.on('welcome', (data) => {
        console.log('Welcome message:', data.message);
        this.emit('welcome', data);
      });

      // 智能体消息
      this.socket.on('agent_message', (message) => {
        console.log('Agent message received:', message.sender, message.content.substring(0, 50));
        this.emit('agent_message', message);
      });

      // 系统消息
      this.socket.on('system_message', (message) => {
        console.log('System message:', message.type);
        this.emit('system_message', message);
      });

      // 智能体状态更新
      this.socket.on('agent_status_update', (update) => {
        console.log('Agent status update:', update.agentId, update.status);
        this.emit('agent_status_update', update);
      });

      // 所有智能体状态
      this.socket.on('all_agents_status', (data) => {
        console.log('All agents status received:', data.agents.length, 'agents');
        this.emit('all_agents_status', data);
      });

      // 智能体加入确认
      this.socket.on('agent_joined', (data) => {
        console.log('Joined agent:', data.agent.name);
        this.emit('agent_joined', data);
      });

      // 用户加入通知
      this.socket.on('user_joined', (data) => {
        console.log('User joined:', data.userId);
        this.emit('user_joined', data);
      });

      return this.socket;
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      this.emit('connection_error', { error: error.message });
      return null;
    }
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
      console.log('Socket disconnected');
    }
  }

  // 加入智能体聊天
  joinAgent(agentId) {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot join agent: socket not connected');
      return false;
    }

    this.socket.emit('join_agent', { agentId });
    console.log('Joining agent:', agentId);
    return true;
  }

  // 发送消息给智能体
  sendToAgent(agentId, content, type = 'text') {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot send message: socket not connected');
      return false;
    }

    this.socket.emit('send_to_agent', { agentId, content, type });
    console.log('Sending to agent:', agentId, content.substring(0, 50));
    return true;
  }

  // 分配任务给智能体
  assignTask(agentId, task, priority = 'normal') {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot assign task: socket not connected');
      return false;
    }

    this.socket.emit('assign_task', { agentId, task, priority });
    console.log('Assigning task to agent:', agentId, task);
    return true;
  }

  // 获取智能体状态
  getAgentStatus(agentId) {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot get status: socket not connected');
      return false;
    }

    this.socket.emit('get_agent_status', { agentId });
    console.log('Getting status for agent:', agentId);
    return true;
  }

  // 获取所有智能体状态
  getAllAgentsStatus() {
    if (!this.socket || !this.isConnected) {
      console.error('Cannot get all status: socket not connected');
      return false;
    }

    this.socket.emit('get_all_agents_status');
    console.log('Getting all agents status');
    return true;
  }

  // 事件监听器管理
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // 获取连接状态
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  }

  // 检查是否连接
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

// 创建单例实例
let socketInstance = null;

export function getSocketClient() {
  if (!socketInstance) {
    socketInstance = new SocketClient();
  }
  return socketInstance;
}

export function connectSocket() {
  const client = getSocketClient();
  return client.connect();
}

export function disconnectSocket() {
  const client = getSocketClient();
  client.disconnect();
}

export default getSocketClient;