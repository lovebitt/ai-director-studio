import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AgentChatWindow from '../../components/studio/AgentChatWindow';
import TaskManager from '../../components/studio/TaskManager';
import RealTimeMonitor from '../../components/studio/RealTimeMonitor';
import ConnectionDiagnostic from '../../components/studio/ConnectionDiagnostic';
import { getSocketClient } from '../../lib/socket/client';
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Settings,
  Zap,
  Bell,
  HelpCircle
} from '../../components/SimpleIcons';

export default function StudioPage() {
  const [socketClient, setSocketClient] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [activeAgent, setActiveAgent] = useState('main');
  const [agents, setAgents] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // 初始化Socket连接
  useEffect(() => {
    const client = getSocketClient();
    setSocketClient(client);

    // 连接事件监听
    client.on('connection_established', () => {
      setConnectionStatus('connected');
      console.log('Socket connected');
    });

    client.on('connection_error', (data) => {
      setConnectionStatus('error');
      console.error('Connection error:', data.error);
    });

    client.on('connection_lost', () => {
      setConnectionStatus('disconnected');
      console.log('Connection lost');
    });

    client.on('welcome', (data) => {
      setAgents(data.agents);
      console.log('Welcome received:', data.agents.length, 'agents');
    });

    client.on('agent_status_update', (update) => {
      setAgents(prev => prev.map(agent => 
        agent.id === update.agentId ? { ...agent, ...update } : agent
      ));
    });

    client.on('system_message', (message) => {
      addNotification({
        type: 'system',
        title: '系统消息',
        content: message.type === 'task_assigned' 
          ? `任务已分配给智能体: ${message.task}` 
          : `任务完成: ${message.task}`,
        timestamp: new Date(message.timestamp),
      });
    });

    // 连接Socket
    client.connect();

    // 清理函数
    return () => {
      client.off('connection_established');
      client.off('connection_error');
      client.off('connection_lost');
      client.off('welcome');
      client.off('agent_status_update');
      client.off('system_message');
    };
  }, []);

  // 添加通知
  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  // 选择智能体
  const selectAgent = (agentId) => {
    setActiveAgent(agentId);
    if (socketClient) {
      socketClient.joinAgent(agentId);
    }
  };

  // 发送消息给当前智能体
  const sendMessage = (content) => {
    if (socketClient && activeAgent) {
      socketClient.sendToAgent(activeAgent, content);
    }
  };

  // 分配任务
  const assignTask = (agentId, task) => {
    if (socketClient) {
      socketClient.assignTask(agentId, task);
    }
  };

  // 获取连接状态文本
  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return '🟢 已连接';
      case 'connecting': return '🟡 连接中';
      case 'error': return '🔴 连接错误';
      default: return '⚪ 未连接';
    }
  };

  return (
    <>
      <Head>
        <title>智能工作室 - AI导演系统</title>
        <meta name="description" content="实时与AI智能体协作创作，监控工作进度，指导创作过程" />
      </Head>
      
      <Navbar />
      
      <main className="pt-16 min-h-screen bg-gradient-to-br from-paper-white to-rough-blue/5">
        {/* 工作室头部 */}
        <div className="border-b border-charcoal/10 bg-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-charcoal">
                  🎬 智能工作室
                </h1>
                <p className="text-charcoal/60 mt-1">
                  实时与AI智能体协作创作，监控工作进度，指导创作过程
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-100 text-green-700' 
                    : connectionStatus === 'error'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {getConnectionStatusText()}
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-charcoal/70" />
                  </button>
                  <button className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-charcoal/70" />
                  </button>
                  <button className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
                    <HelpCircle className="w-5 h-5 text-charcoal/70" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 主工作区 */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 左侧边栏 - 智能体列表 */}
            <div className="lg:col-span-3">
              <div className="card-delicate">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-rough-blue" />
                  <h2 className="text-lg font-semibold">智能体团队</h2>
                  <span className="ml-auto text-sm text-charcoal/50">
                    {agents.filter(a => a.status === 'online').length}/{agents.length} 在线
                  </span>
                </div>
                
                <div className="space-y-2">
                  {agents.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => selectAgent(agent.id)}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        activeAgent === agent.id
                          ? 'bg-rough-blue/10 border border-rough-blue/20'
                          : 'hover:bg-charcoal/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          agent.status === 'online' ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <div className="font-medium">{agent.name}</div>
                          <div className="text-sm text-charcoal/60 truncate">
                            {agent.currentTask}
                          </div>
                        </div>
                        {agent.progress > 0 && agent.progress < 100 && (
                          <div className="text-xs font-medium text-rough-blue">
                            {agent.progress}%
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-charcoal/10">
                  <div className="text-sm text-charcoal/60 mb-2">快速操作</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => socketClient?.getAllAgentsStatus()}
                      className="p-2 text-sm bg-charcoal/5 hover:bg-charcoal/10 rounded transition-colors"
                    >
                      刷新状态
                    </button>
                    <button 
                      onClick={() => assignTask(activeAgent, '新创作任务')}
                      className="p-2 text-sm bg-rough-blue/10 hover:bg-rough-blue/20 text-rough-blue rounded transition-colors"
                    >
                      分配任务
                    </button>
                  </div>
                </div>
              </div>

              {/* 任务面板 */}
              <div className="mt-6">
                <TaskManager socketClient={socketClient} />
              </div>
            </div>

            {/* 中间区域 - 聊天和工作区 */}
            <div className="lg:col-span-6">
              <div className="card-delicate h-full">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-misty-purple" />
                  <h2 className="text-lg font-semibold">
                    {agents.find(a => a.id === activeAgent)?.name || '智能体'} 对话
                  </h2>
                  <div className="ml-auto flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs ${
                      agents.find(a => a.id === activeAgent)?.status === 'online'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {agents.find(a => a.id === activeAgent)?.status === 'online' ? '在线' : '离线'}
                    </div>
                  </div>
                </div>
                
                <div className="h-[calc(100vh-300px)]">
                  <AgentChatWindow 
                    agentId={activeAgent}
                    socketClient={socketClient}
                    onSendMessage={sendMessage}
                  />
                </div>
              </div>
            </div>

            {/* 右侧边栏 - 监控和工具 */}
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {/* 实时监控 */}
                <RealTimeMonitor agents={agents} />

                {/* 系统概览 */}
                <div className="card-delicate">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-sage-green" />
                    <h2 className="text-lg font-semibold">系统概览</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-charcoal/5 rounded-lg">
                        <div className="text-2xl font-bold text-rough-blue">
                          {agents.length}
                        </div>
                        <div className="text-sm text-charcoal/60 mt-1">智能体总数</div>
                      </div>
                      <div className="text-center p-3 bg-charcoal/5 rounded-lg">
                        <div className="text-2xl font-bold text-misty-purple">
                          {agents.filter(a => a.status === 'working').length}
                        </div>
                        <div className="text-sm text-charcoal/60 mt-1">工作中</div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-charcoal/10">
                      <div className="text-sm text-charcoal/60 mb-2">今日统计</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>消息总数</span>
                          <span className="font-medium">0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>任务完成</span>
                          <span className="font-medium">0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>协作次数</span>
                          <span className="font-medium">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 通知面板 */}
                {notifications.length > 0 && (
                  <div className="card-delicate">
                    <div className="flex items-center gap-2 mb-4">
                      <Bell className="w-5 h-5 text-dusty-pink" />
                      <h2 className="text-lg font-semibold">最新通知</h2>
                      <button 
                        onClick={() => setNotifications([])}
                        className="ml-auto text-sm text-charcoal/50 hover:text-charcoal"
                      >
                        清空
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {notifications.map((notif, index) => (
                        <div 
                          key={index}
                          className="p-3 bg-charcoal/5 rounded-lg"
                        >
                          <div className="text-sm font-medium mb-1">{notif.title}</div>
                          <div className="text-sm text-charcoal/70">{notif.content}</div>
                          <div className="text-xs text-charcoal/50 mt-2">
                            {notif.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 底部状态栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-charcoal/10 py-2">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-rough-blue" />
                  <span>AI导演系统 v2.0</span>
                </div>
                <div className="text-charcoal/50">
                  智能工作室 | 多智能体协作平台
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-charcoal/50">
                  最后更新: {new Date().toLocaleTimeString()}
                </div>
                <div className={`px-2 py-1 rounded text-xs ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {getConnectionStatusText()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
      {/* 连接诊断工具 */}
      <ConnectionDiagnostic socketClient={socketClient} />
}