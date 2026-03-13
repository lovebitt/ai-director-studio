import { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Image as ImageIcon, FileText, Smile, Bot, User } from 'lucide-react';

export default function AgentChatWindow({ agentId, socketClient, onSendMessage }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 初始化消息
  const initialMessages = [
    {
      id: 'welcome',
      type: 'system',
      sender: 'system',
      content: `欢迎与智能体对话！您可以询问创作建议、分配任务或讨论具体项目。`,
      timestamp: Date.now() - 60000,
    },
    {
      id: 'agent_intro',
      type: 'agent_message',
      sender: agentId,
      content: getAgentIntroduction(agentId),
      timestamp: Date.now() - 30000,
    },
  ];

  // 监听Socket消息
  useEffect(() => {
    if (!socketClient) return;

    const handleAgentMessage = (message) => {
      if (message.agentId === agentId) {
        setMessages(prev => [...prev, message]);
        setIsTyping(false);
      }
    };

    const handleAgentJoined = (data) => {
      if (data.agent.id === agentId) {
        setMessages(data.history || initialMessages);
      }
    };

    socketClient.on('agent_message', handleAgentMessage);
    socketClient.on('agent_joined', handleAgentJoined);

    // 加入智能体聊天
    socketClient.joinAgent(agentId);

    // 设置初始消息
    setMessages(initialMessages);

    return () => {
      socketClient.off('agent_message', handleAgentMessage);
      socketClient.off('agent_joined', handleAgentJoined);
    };
  }, [agentId, socketClient]);

  // 滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!inputValue.trim() || !socketClient) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user_message',
      sender: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    // 添加到本地消息列表
    setMessages(prev => [...prev, userMessage]);
    
    // 发送到服务器
    if (onSendMessage) {
      onSendMessage(inputValue);
    }

    // 清空输入框
    setInputValue('');
    
    // 显示输入中状态
    setIsTyping(true);
    
    // 聚焦输入框
    inputRef.current?.focus();
  };

  // 处理按键
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 获取智能体介绍
  function getAgentIntroduction(agentId) {
    const introductions = {
      main: '我是主智能体，负责协调整个创作团队。我可以帮您分配任务、监控进度、解决协作问题。请问有什么需要协调的吗？',
      visual: '我是视觉风格智能体，专注于视觉研究和风格分析。我可以帮您设计视觉风格、收集参考图、制定色彩方案。您有什么视觉创作需求吗？',
      dreamai: '我是即梦AI专家，精通AI生成优化。我可以帮您设计提示词、优化生成参数、评估生成效果。想要创作什么类型的图像呢？',
      narrative: '我是总编剧，擅长故事创作和角色设计。我可以帮您构思故事、塑造角色、编写剧本。有什么故事想要创作吗？',
      storyboard: '我是分镜导演，专注于视觉叙事和镜头语言。我可以帮您设计分镜、规划镜头、控制节奏。需要将故事转化为视觉画面吗？',
    };
    return introductions[agentId] || '您好！我是AI创作助手，很高兴为您服务。';
  }

  // 获取智能体图标
  function getAgentIcon(agentId) {
    const icons = {
      main: '🎬',
      visual: '🎨',
      dreamai: '🤖',
      narrative: '🎭',
      storyboard: '🎞️',
    };
    return icons[agentId] || '🤖';
  }

  // 格式化时间
  function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // 渲染消息
  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
    const isAgent = !isUser && !isSystem;

    return (
      <div
        key={message.id}
        className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : ''}`}
      >
        {/* 头像 */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-rough-blue text-white' 
            : isSystem
            ? 'bg-charcoal/20 text-charcoal'
            : 'bg-misty-purple/20 text-misty-purple'
        }`}>
          {isUser ? (
            <User className="w-4 h-4" />
          ) : isSystem ? (
            '⚙️'
          ) : (
            <span className="text-lg">{getAgentIcon(message.sender)}</span>
          )}
        </div>

        {/* 消息内容 */}
        <div className={`flex-1 ${isUser ? 'items-end' : ''}`}>
          {/* 发送者信息 */}
          <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : ''}`}>
            <span className="text-sm font-medium text-charcoal">
              {isUser ? '您' : isSystem ? '系统' : message.senderName || message.sender}
            </span>
            <span className="text-xs text-charcoal/50">
              {formatTime(message.timestamp)}
            </span>
          </div>

          {/* 消息气泡 */}
          <div className={`rounded-2xl px-4 py-3 max-w-[80%] ${
            isUser
              ? 'bg-rough-blue text-white rounded-br-none'
              : isSystem
              ? 'bg-charcoal/10 text-charcoal'
              : 'bg-white border border-charcoal/10 text-charcoal rounded-bl-none'
          }`}>
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>

            {/* 附件 */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-black/5 rounded-lg"
                  >
                    {attachment.type === 'file' ? (
                      <FileText className="w-4 h-4" />
                    ) : attachment.type === 'image' ? (
                      <ImageIcon className="w-4 h-4" />
                    ) : null}
                    <span className="text-sm flex-1 truncate">
                      {attachment.name}
                    </span>
                    <button className="text-xs text-rough-blue hover:text-rough-blue/80">
                      下载
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map(renderMessage)}
          
          {/* 输入中状态 */}
          {isTyping && (
            <div className="flex gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-misty-purple/20 text-misty-purple flex items-center justify-center">
                <span className="text-lg">{getAgentIcon(agentId)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-charcoal">
                    {agentId === 'main' ? '主智能体' : 
                     agentId === 'visual' ? '视觉风格智能体' :
                     agentId === 'dreamai' ? '即梦AI专家' :
                     agentId === 'narrative' ? '总编剧' :
                     agentId === 'storyboard' ? '分镜导演' : '智能体'}
                  </span>
                </div>
                <div className="bg-white border border-charcoal/10 rounded-2xl rounded-bl-none px-4 py-3 inline-block">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-charcoal/40 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-charcoal/40 rounded-full animate-pulse delay-150" />
                    <div className="w-2 h-2 bg-charcoal/40 rounded-full animate-pulse delay-300" />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t border-charcoal/10 p-4">
        <div className="flex items-end gap-2">
          {/* 工具栏 */}
          <div className="flex gap-1 mb-2">
            <button className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
              <Paperclip className="w-4 h-4 text-charcoal/60" />
            </button>
            <button className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
              <ImageIcon className="w-4 h-4 text-charcoal/60" />
            </button>
            <button className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
              <Smile className="w-4 h-4 text-charcoal/60" />
            </button>
          </div>

          {/* 文本输入 */}
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`输入消息给${
                agentId === 'main' ? '主智能体' : 
                agentId === 'visual' ? '视觉风格智能体' :
                agentId === 'dreamai' ? '即梦AI专家' :
                agentId === 'narrative' ? '总编剧' :
                agentId === 'storyboard' ? '分镜导演' : '智能体'
              }...`}
              className="w-full min-h-[60px] max-h-[120px] p-3 border border-charcoal/20 rounded-lg resize-none focus:outline-none focus:border-rough-blue focus:ring-1 focus:ring-rough-blue/20"
              rows={1}
            />
          </div>

          {/* 发送按钮 */}
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={`p-3 rounded-lg transition-colors ${
              inputValue.trim()
                ? 'bg-rough-blue text-white hover:bg-rough-blue/90'
                : 'bg-charcoal/10 text-charcoal/40 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* 快捷提示 */}
        <div className="mt-2 text-xs text-charcoal/50">
          提示: 按 Enter 发送，Shift + Enter 换行。尝试询问"帮我设计一个故事"或"优化这个提示词"
        </div>
      </div>
    </div>
  );
}