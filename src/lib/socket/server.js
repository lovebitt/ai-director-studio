import { Server } from 'socket.io';

// 智能体状态存储
const agentStates = new Map();
// 用户会话存储
const userSessions = new Map();
// 消息历史存储
const messageHistory = new Map();

// 初始化智能体状态
const initializeAgentStates = () => {
  const agents = [
    { id: 'main', name: '主智能体', status: 'online', type: 'coordinator' },
    { id: 'visual', name: '视觉风格智能体', status: 'online', type: 'visual' },
    { id: 'dreamai', name: '即梦AI专家智能体', status: 'online', type: 'ai' },
    { id: 'narrative', name: '总编剧智能体', status: 'online', type: 'narrative' },
    { id: 'storyboard', name: '分镜智能体', status: 'online', type: 'storyboard' },
  ];

  agents.forEach(agent => {
    agentStates.set(agent.id, {
      ...agent,
      currentTask: '等待任务分配',
      progress: 0,
      lastSeen: Date.now(),
      capabilities: getAgentCapabilities(agent.id),
    });
    
    // 初始化消息历史
    messageHistory.set(agent.id, []);
  });
};

// 获取智能体能力
const getAgentCapabilities = (agentId) => {
  const capabilities = {
    main: ['协调管理', '任务分配', '进度监控', '冲突解决'],
    visual: ['视觉分析', '风格研究', '参考收集', '色彩设计'],
    dreamai: ['提示词优化', '参数测试', '生成评估', '工作流设计'],
    narrative: ['故事创作', '角色设计', '剧本写作', '情节规划'],
    storyboard: ['分镜设计', '视觉叙事', '镜头语言', '节奏控制'],
  };
  
  return capabilities[agentId] || [];
};

// 创建Socket.IO服务器
export default function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log('Socket is already running');
    res.end();
    return;
  }

  console.log('Starting Socket.IO server...');
  
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // 初始化智能体状态
  initializeAgentStates();

  // 连接事件处理
  io.on('connection', (socket) => {
    console.log(`用户连接: ${socket.id}`);
    
    // 发送欢迎消息和初始状态
    socket.emit('welcome', {
      message: '欢迎来到AI导演智能工作室',
      timestamp: Date.now(),
      agents: Array.from(agentStates.values()),
    });

    // 用户加入智能体聊天
    socket.on('join_agent', ({ agentId }) => {
      console.log(`用户 ${socket.id} 加入智能体 ${agentId} 聊天`);
      
      // 加入智能体房间
      socket.join(`agent:${agentId}`);
      
      // 发送智能体信息和历史消息
      const agent = agentStates.get(agentId);
      const history = messageHistory.get(agentId) || [];
      
      socket.emit('agent_joined', {
        agent,
        history,
        timestamp: Date.now(),
      });
      
      // 通知其他用户该智能体有新用户加入
      socket.to(`agent:${agentId}`).emit('user_joined', {
        userId: socket.id,
        timestamp: Date.now(),
      });
    });

    // 用户发送消息给智能体
    socket.on('send_to_agent', ({ agentId, content, type = 'text' }) => {
      console.log(`用户 ${socket.id} 发送消息给智能体 ${agentId}: ${content.substring(0, 50)}...`);
      
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'user_message',
        sender: 'user',
        senderId: socket.id,
        agentId,
        content,
        messageType: type,
        timestamp: Date.now(),
      };
      
      // 保存到历史
      const history = messageHistory.get(agentId) || [];
      history.push(message);
      messageHistory.set(agentId, history.slice(-100)); // 只保留最近100条
      
      // 广播给所有在智能体房间的用户
      io.to(`agent:${agentId}`).emit('agent_message', message);
      
      // 模拟智能体响应（实际应该调用智能体API）
      setTimeout(() => {
        const agentResponse = createAgentResponse(agentId, content);
        const responseMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'agent_message',
          sender: agentId,
          senderName: agentStates.get(agentId)?.name || agentId,
          agentId,
          content: agentResponse.content,
          messageType: agentResponse.type,
          attachments: agentResponse.attachments,
          timestamp: Date.now(),
        };
        
        // 保存到历史
        const updatedHistory = messageHistory.get(agentId) || [];
        updatedHistory.push(responseMessage);
        messageHistory.set(agentId, updatedHistory.slice(-100));
        
        // 广播响应
        io.to(`agent:${agentId}`).emit('agent_message', responseMessage);
      }, 1000 + Math.random() * 2000); // 随机延迟1-3秒
    });

    // 分配任务给智能体
    socket.on('assign_task', ({ agentId, task, priority = 'normal' }) => {
      console.log(`分配任务给智能体 ${agentId}: ${task}`);
      
      const agent = agentStates.get(agentId);
      if (agent) {
        // 更新智能体状态
        agentStates.set(agentId, {
          ...agent,
          currentTask: task,
          status: 'working',
          progress: 10,
          lastUpdate: Date.now(),
        });
        
        // 广播状态更新
        io.emit('agent_status_update', {
          agentId,
          status: 'working',
          currentTask: task,
          progress: 10,
          timestamp: Date.now(),
        });
        
        // 发送任务确认消息
        const taskMessage = {
          id: `task_${Date.now()}`,
          type: 'task_assigned',
          sender: 'system',
          agentId,
          task,
          priority,
          timestamp: Date.now(),
        };
        
        io.to(`agent:${agentId}`).emit('system_message', taskMessage);
        
        // 模拟任务进度更新
        simulateTaskProgress(io, agentId, task);
      }
    });

    // 请求智能体状态
    socket.on('get_agent_status', ({ agentId }) => {
      const agent = agentStates.get(agentId);
      if (agent) {
        socket.emit('agent_status', {
          agentId,
          ...agent,
          timestamp: Date.now(),
        });
      }
    });

    // 请求所有智能体状态
    socket.on('get_all_agents_status', () => {
      const agents = Array.from(agentStates.values());
      socket.emit('all_agents_status', {
        agents,
        timestamp: Date.now(),
      });
    });

    // 断开连接
    socket.on('disconnect', () => {
      console.log(`用户断开连接: ${socket.id}`);
      // 清理用户会话
      userSessions.delete(socket.id);
    });
  });

  res.socket.server.io = io;
  res.end();
}

// 创建智能体响应
const createAgentResponse = (agentId, userMessage) => {
  const responses = {
    main: {
      content: `收到您的消息。作为主智能体，我会协调其他智能体为您服务。请问您需要什么帮助？`,
      type: 'text',
    },
    visual: {
      content: `您好！我是视觉风格智能体。您提到的内容让我想到了一些视觉可能性。基于粗粝细腻主义风格，我可以为您提供以下建议...`,
      type: 'text',
      attachments: [
        {
          type: 'file',
          name: '视觉参考建议.md',
          url: '/api/files/visual-suggestions.md',
        },
      ],
    },
    dreamai: {
      content: `我是即梦AI专家。针对您的需求，我建议使用以下提示词变体进行测试...`,
      type: 'text',
      attachments: [
        {
          type: 'file',
          name: '提示词优化建议.md',
          url: '/api/files/prompt-suggestions.md',
        },
      ],
    },
    narrative: {
      content: `作为总编剧，我很乐意帮助您创作故事。您提到的主题很有潜力，让我为您构思一个故事框架...`,
      type: 'text',
      attachments: [
        {
          type: 'file',
          name: '故事大纲草案.md',
          url: '/api/files/story-outline.md',
        },
      ],
    },
    storyboard: {
      content: `我是分镜导演。基于您的描述，我建议采用以下镜头语言来增强叙事效果...`,
      type: 'text',
      attachments: [
        {
          type: 'file',
          name: '分镜设计建议.md',
          url: '/api/files/storyboard-suggestions.md',
        },
      ],
    },
  };

  return responses[agentId] || {
    content: `我是${agentId}，很高兴为您服务。请问有什么可以帮助您的？`,
    type: 'text',
  };
};

// 模拟任务进度更新
const simulateTaskProgress = (io, agentId, task) => {
  let progress = 10;
  const interval = setInterval(() => {
    progress += 10 + Math.random() * 20;
    
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // 任务完成
      const agent = agentStates.get(agentId);
      if (agent) {
        agentStates.set(agentId, {
          ...agent,
          status: 'completed',
          progress: 100,
          currentTask: '任务完成',
          lastUpdate: Date.now(),
        });
        
        io.emit('agent_status_update', {
          agentId,
          status: 'completed',
          currentTask: '任务完成',
          progress: 100,
          timestamp: Date.now(),
        });
        
        // 发送完成消息
        const completionMessage = {
          id: `complete_${Date.now()}`,
          type: 'task_completed',
          sender: 'system',
          agentId,
          task,
          result: '任务成功完成',
          timestamp: Date.now(),
        };
        
        io.to(`agent:${agentId}`).emit('system_message', completionMessage);
      }
    } else {
      // 更新进度
      const agent = agentStates.get(agentId);
      if (agent) {
        agentStates.set(agentId, {
          ...agent,
          progress: Math.min(progress, 99),
          lastUpdate: Date.now(),
        });
        
        io.emit('agent_status_update', {
          agentId,
          status: 'working',
          currentTask: task,
          progress: Math.min(progress, 99),
          timestamp: Date.now(),
        });
      }
    }
  }, 3000); // 每3秒更新一次进度
};