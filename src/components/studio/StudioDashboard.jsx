import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  FileText,
  MessageSquare,
  Zap,
  Target
} from 'lucide-react';

export default function StudioDashboard({ socketClient }) {
  const [dashboardStats, setDashboardStats] = useState({
    totalMessages: 0,
    completedTasks: 0,
    activeCollaborations: 0,
    avgResponseTime: 0,
    productivityScore: 75,
    systemEfficiency: 88,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [performanceTrend, setPerformanceTrend] = useState([]);

  // 初始化数据
  useEffect(() => {
    // 模拟初始数据
    const initialActivities = [
      {
        id: 'act_1',
        type: 'task_completed',
        agent: 'visual',
        description: '完成参考图收集任务',
        timestamp: Date.now() - 1800000, // 30分钟前
        importance: 'high',
      },
      {
        id: 'act_2',
        type: 'message_sent',
        agent: 'narrative',
        description: '发送剧本创作建议',
        timestamp: Date.now() - 3600000, // 1小时前
        importance: 'medium',
      },
      {
        id: 'act_3',
        type: 'collaboration_started',
        agent: 'storyboard',
        description: '开始与总编剧协作',
        timestamp: Date.now() - 5400000, // 1.5小时前
        importance: 'high',
      },
      {
        id: 'act_4',
        type: 'system_optimization',
        agent: 'main',
        description: '优化任务分配算法',
        timestamp: Date.now() - 7200000, // 2小时前
        importance: 'medium',
      },
    ];

    // 模拟性能趋势数据
    const initialTrend = [];
    const now = Date.now();
    for (let i = 7; i >= 0; i--) {
      initialTrend.push({
        day: `D-${i}`,
        productivity: 60 + Math.random() * 30,
        efficiency: 70 + Math.random() * 25,
        collaboration: 40 + Math.random() * 40,
      });
    }

    setRecentActivities(initialActivities);
    setPerformanceTrend(initialTrend);

    // 监听Socket更新
    if (socketClient) {
      socketClient.on('agent_message', () => {
        setDashboardStats(prev => ({
          ...prev,
          totalMessages: prev.totalMessages + 1,
        }));
      });

      socketClient.on('task_completed', () => {
        setDashboardStats(prev => ({
          ...prev,
          completedTasks: prev.completedTasks + 1,
        }));
      });
    }
  }, [socketClient]);

  // 获取活动图标
  const getActivityIcon = (type) => {
    const icons = {
      task_completed: CheckCircle,
      message_sent: MessageSquare,
      collaboration_started: Users,
      system_optimization: Zap,
    };
    return icons[type] || Clock;
  };

  // 获取活动颜色
  const getActivityColor = (type) => {
    const colors = {
      task_completed: 'text-green-500 bg-green-100',
      message_sent: 'text-blue-500 bg-blue-100',
      collaboration_started: 'text-purple-500 bg-purple-100',
      system_optimization: 'text-amber-500 bg-amber-100',
    };
    return colors[type] || 'text-gray-500 bg-gray-100';
  };

  // 格式化时间
  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  // 获取智能体名称
  const getAgentName = (agentId) => {
    const names = {
      main: '主智能体',
      visual: '视觉风格',
      dreamai: '即梦AI',
      narrative: '总编剧',
      storyboard: '分镜导演',
    };
    return names[agentId] || agentId;
  };

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-delicate">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-rough-blue">
                {dashboardStats.totalMessages}
              </div>
              <div className="text-sm text-charcoal/60 mt-1">消息总数</div>
            </div>
            <div className="p-3 bg-rough-blue/10 rounded-lg">
              <MessageSquare className="w-6 h-6 text-rough-blue" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-charcoal/10">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% 今日增长</span>
            </div>
          </div>
        </div>

        <div className="card-delicate">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-misty-purple">
                {dashboardStats.completedTasks}
              </div>
              <div className="text-sm text-charcoal/60 mt-1">完成任务</div>
            </div>
            <div className="p-3 bg-misty-purple/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-misty-purple" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-charcoal/10">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+8% 本周增长</span>
            </div>
          </div>
        </div>

        <div className="card-delicate">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-sage-green">
                {dashboardStats.activeCollaborations}
              </div>
              <div className="text-sm text-charcoal/60 mt-1">活跃协作</div>
            </div>
            <div className="p-3 bg-sage-green/10 rounded-lg">
              <Users className="w-6 h-6 text-sage-green" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-charcoal/10">
            <div className="flex items-center text-sm text-blue-600">
              <Target className="w-4 h-4 mr-1" />
              <span>3个进行中</span>
            </div>
          </div>
        </div>

        <div className="card-delicate">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-dusty-pink">
                {dashboardStats.avgResponseTime}ms
              </div>
              <div className="text-sm text-charcoal/60 mt-1">平均响应</div>
            </div>
            <div className="p-3 bg-dusty-pink/10 rounded-lg">
              <Zap className="w-6 h-6 text-dusty-pink" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-charcoal/10">
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>-15% 响应优化</span>
            </div>
          </div>
        </div>
      </div>

      {/* 性能指标 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 生产力评分 */}
        <div className="card-delicate">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-rough-blue" />
              <h3 className="text-lg font-semibold">生产力评分</h3>
            </div>
            <div className="text-sm text-charcoal/60">
              本周表现
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>整体生产力</span>
                <span className="font-medium">{dashboardStats.productivityScore}/100</span>
              </div>
              <div className="h-2 bg-charcoal/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rough-blue to-misty-purple rounded-full"
                  style={{ width: `${dashboardStats.productivityScore}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>系统效率</span>
                <span className="font-medium">{dashboardStats.systemEfficiency}/100</span>
              </div>
              <div className="h-2 bg-charcoal/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sage-green to-dusty-pink rounded-full"
                  style={{ width: `${dashboardStats.systemEfficiency}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-charcoal/10">
            <div className="text-sm font-medium mb-3">性能趋势</div>
            <div className="h-32">
              <div className="flex h-full items-end space-x-1">
                {performanceTrend.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="flex items-end space-x-1 flex-1 w-full">
                      <div
                        className="flex-1 bg-rough-blue/30 rounded-t"
                        style={{ height: `${day.productivity}%` }}
                      />
                      <div
                        className="flex-1 bg-sage-green/30 rounded-t"
                        style={{ height: `${day.efficiency}%` }}
                      />
                    </div>
                    <div className="text-xs text-charcoal/50 mt-2">{day.day}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-rough-blue/30 rounded" />
                <span>生产力</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-sage-green/30 rounded" />
                <span>效率</span>
              </div>
            </div>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="card-delicate">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-misty-purple" />
              <h3 className="text-lg font-semibold">最近活动</h3>
            </div>
            <button className="text-sm text-rough-blue hover:text-rough-blue/80">
              查看全部
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map(activity => {
              const ActivityIcon = getActivityIcon(activity.type);
              
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 hover:bg-charcoal/5 rounded-lg transition-colors"
                >
                  <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                    <ActivityIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">
                        {getAgentName(activity.agent)}
                      </div>
                      <div className="text-xs text-charcoal/50">
                        {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                    <p className="text-sm text-charcoal/70 mt-1">
                      {activity.description}
                    </p>
                    {activity.importance === 'high' && (
                      <div className="inline-block mt-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                        重要
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-charcoal/10">
            <div className="text-sm font-medium mb-3">活动统计</div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-charcoal/5 rounded">
                <div className="text-lg font-bold text-rough-blue">
                  {recentActivities.filter(a => a.type === 'task_completed').length}
                </div>
                <div className="text-xs text-charcoal/60">任务完成</div>
              </div>
              <div className="text-center p-2 bg-charcoal/5 rounded">
                <div className="text-lg font-bold text-misty-purple">
                  {recentActivities.filter(a => a.type === 'message_sent').length}
                </div>
                <div className="text-xs text-charcoal/60">消息发送</div>
              </div>
              <div className="text-center p-2 bg-charcoal/5 rounded">
                <div className="text-lg font-bold text-sage-green">
                  {recentActivities.filter(a => a.type === 'collaboration_started').length}
                </div>
                <div className="text-xs text-charcoal/60">协作开始</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速洞察 */}
      <div className="card-delicate">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-sage-green" />
            <h3 className="text-lg font-semibold">快速洞察</h3>
          </div>
          <div className="text-sm text-charcoal/60">
            基于当前数据分析
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-br from-rough-blue/5 to-misty-purple/5 rounded-lg">
            <div className="text-sm font-medium mb-2">⏱️ 响应时间优化</div>
            <p className="text-sm text-charcoal/70">
              智能体平均响应时间较上周下降15%，系统响应效率显著提升。
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-sage-green/5 to-dusty-pink/5 rounded-lg">
            <div className="text-sm font-medium mb-2">🤝 协作频率增加</div>
            <p className="text-sm text-charcoal/70">
              智能体间协作次数增长25%，多智能体协同创作效果显著。
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-amber-500/5 to-red-500/5 rounded-lg">
            <div className="text-sm font-medium mb-2">🎯 任务完成率</div>
            <p className="text-sm text-charcoal/70">
              本周任务完成率达到92%，较上周提升8%，工作效率持续优化。
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-charcoal/10">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-medium">建议：</span>
              <span className="text-charcoal/70 ml-2">
                考虑增加视觉风格智能体与分镜导演的协作频率，可提升创作效率30%
              </span>
            </div>
            <button className="text-sm text-rough-blue hover:text-rough-blue/80">
              应用建议
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}