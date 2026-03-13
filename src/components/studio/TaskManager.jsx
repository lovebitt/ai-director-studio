import { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, Play, Pause, Trash2, Plus, Filter } from 'lucide-react';

export default function TaskManager({ socketClient }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('visual');
  const [filter, setFilter] = useState('all');

  // 初始示例任务
  const initialTasks = [
    {
      id: 'task_1',
      title: '收集粗粝细腻主义参考图',
      agentId: 'visual',
      status: 'in_progress',
      progress: 65,
      priority: 'high',
      createdAt: Date.now() - 3600000,
      dueDate: Date.now() + 7200000,
    },
    {
      id: 'task_2',
      title: '设计10种提示词变体',
      agentId: 'dreamai',
      status: 'completed',
      progress: 100,
      priority: 'medium',
      createdAt: Date.now() - 7200000,
      completedAt: Date.now() - 3600000,
    },
    {
      id: 'task_3',
      title: '创作《城市漫游者》剧本大纲',
      agentId: 'narrative',
      status: 'pending',
      progress: 0,
      priority: 'high',
      createdAt: Date.now() - 1800000,
      dueDate: Date.now() + 86400000,
    },
    {
      id: 'task_4',
      title: '设计分镜脚本框架',
      agentId: 'storyboard',
      status: 'in_progress',
      progress: 30,
      priority: 'medium',
      createdAt: Date.now() - 900000,
      dueDate: Date.now() + 43200000,
    },
  ];

  // 监听任务更新
  useEffect(() => {
    if (!socketClient) return;

    const handleTaskUpdate = (update) => {
      setTasks(prev => prev.map(task => 
        task.id === update.taskId ? { ...task, ...update } : task
      ));
    };

    socketClient.on('task_update', handleTaskUpdate);

    // 设置初始任务
    setTasks(initialTasks);

    return () => {
      socketClient.off('task_update', handleTaskUpdate);
    };
  }, [socketClient]);

  // 添加新任务
  const handleAddTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: `task_${Date.now()}`,
      title: newTask,
      agentId: selectedAgent,
      status: 'pending',
      progress: 0,
      priority: 'medium',
      createdAt: Date.now(),
      dueDate: Date.now() + 86400000, // 24小时后
    };

    setTasks(prev => [task, ...prev]);
    
    // 通过Socket分配任务
    if (socketClient) {
      socketClient.assignTask(selectedAgent, newTask);
    }

    setNewTask('');
  };

  // 更新任务状态
  const updateTaskStatus = (taskId, status) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  // 删除任务
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // 获取智能体名称
  const getAgentName = (agentId) => {
    const agents = {
      main: '主智能体',
      visual: '视觉风格',
      dreamai: '即梦AI',
      narrative: '总编剧',
      storyboard: '分镜导演',
    };
    return agents[agentId] || agentId;
  };

  // 获取智能体颜色
  const getAgentColor = (agentId) => {
    const colors = {
      main: 'bg-sage-green/20 text-sage-green',
      visual: 'bg-rough-blue/20 text-rough-blue',
      dreamai: 'bg-misty-purple/20 text-misty-purple',
      narrative: 'bg-dusty-pink/20 text-dusty-pink',
      storyboard: 'bg-amber-500/20 text-amber-600',
    };
    return colors[agentId] || 'bg-gray-100 text-gray-600';
  };

  // 获取状态信息
  const getStatusInfo = (status) => {
    const info = {
      pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-100' },
      in_progress: { icon: Play, color: 'text-blue-500', bg: 'bg-blue-100' },
      completed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-100' },
      failed: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
    };
    return info[status] || info.pending;
  };

  // 获取优先级标签
  const getPriorityLabel = (priority) => {
    const labels = {
      high: { text: '高', color: 'bg-red-100 text-red-700' },
      medium: { text: '中', color: 'bg-yellow-100 text-yellow-700' },
      low: { text: '低', color: 'bg-green-100 text-green-700' },
    };
    return labels[priority] || labels.medium;
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff > 0) {
      const hours = Math.floor(diff / 3600000);
      if (hours < 1) return '即将到期';
      if (hours < 24) return `${hours}小时后`;
      return `${Math.floor(hours / 24)}天后`;
    } else {
      return '已过期';
    }
  };

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return task.status !== 'completed';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'high') return task.priority === 'high';
    return true;
  });

  return (
    <div className="card-delicate">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-rough-blue" />
          <h2 className="text-lg font-semibold">任务管理</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-charcoal/60">
            {tasks.filter(t => t.status === 'completed').length}/{tasks.length} 完成
          </span>
        </div>
      </div>

      {/* 添加新任务 */}
      <div className="mb-6 p-3 bg-charcoal/5 rounded-lg">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="输入新任务描述..."
            className="flex-1 px-3 py-2 border border-charcoal/20 rounded-lg focus:outline-none focus:border-rough-blue"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-3 py-2 border border-charcoal/20 rounded-lg bg-white focus:outline-none focus:border-rough-blue"
          >
            <option value="visual">🎨 视觉风格</option>
            <option value="dreamai">🤖 即梦AI</option>
            <option value="narrative">🎭 总编剧</option>
            <option value="storyboard">🎞️ 分镜导演</option>
            <option value="main">🎬 主智能体</option>
          </select>
        </div>
        <button
          onClick={handleAddTask}
          className="w-full py-2 bg-rough-blue text-white rounded-lg hover:bg-rough-blue/90 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加任务并分配
        </button>
      </div>

      {/* 过滤器 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { id: 'all', label: '全部' },
          { id: 'active', label: '进行中' },
          { id: 'completed', label: '已完成' },
          { id: 'high', label: '高优先级' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
              filter === item.id
                ? 'bg-rough-blue text-white'
                : 'bg-charcoal/10 text-charcoal/70 hover:bg-charcoal/20'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 任务列表 */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-charcoal/50">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>没有找到任务</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const StatusIcon = getStatusInfo(task.status).icon;
            const priority = getPriorityLabel(task.priority);

            return (
              <div
                key={task.id}
                className="p-3 border border-charcoal/10 rounded-lg hover:border-charcoal/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${getAgentColor(task.agentId)}`}>
                        {getAgentName(task.agentId)}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${priority.color}`}>
                        {priority.text}优先级
                      </span>
                    </div>
                    <h3 className="font-medium text-charcoal">{task.title}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateTaskStatus(task.id, 
                        task.status === 'in_progress' ? 'completed' : 'in_progress'
                      )}
                      className="p-1 hover:bg-charcoal/5 rounded transition-colors"
                    >
                      <StatusIcon className={`w-4 h-4 ${getStatusInfo(task.status).color}`} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>

                {/* 进度条 */}
                {task.status === 'in_progress' && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-charcoal/60 mb-1">
                      <span>进度</span>
                      <span>{task.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rough-blue rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 任务信息 */}
                <div className="flex items-center justify-between text-xs text-charcoal/50">
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-0.5 rounded ${getStatusInfo(task.status).bg} ${getStatusInfo(task.status).color}`}>
                      {task.status === 'pending' && '等待中'}
                      {task.status === 'in_progress' && '进行中'}
                      {task.status === 'completed' && '已完成'}
                      {task.status === 'failed' && '失败'}
                    </span>
                    {task.dueDate && (
                      <span>到期: {formatTime(task.dueDate)}</span>
                    )}
                  </div>
                  {task.completedAt && (
                    <span>完成于 {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 统计信息 */}
      <div className="mt-4 pt-4 border-t border-charcoal/10">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-rough-blue">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-xs text-charcoal/60">进行中</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-xs text-charcoal/60">已完成</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">
              {tasks.filter(t => t.priority === 'high').length}
            </div>
            <div className="text-xs text-charcoal/60">高优先级</div>
          </div>
        </div>
      </div>
    </div>
  );
}