import { useState, useEffect } from 'react';
import { Activity, Cpu, TrendingUp, AlertTriangle, RefreshCw, Zap } from '../../components/SimpleIcons';

export default function RealTimeMonitor({ agents }) {
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 45,
    memoryUsage: 62,
    networkLatency: 28,
    messageRate: 12,
    errorRate: 0.2,
    uptime: 12600, // 3.5小时，单位秒
  });

  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // 初始化性能历史
  useEffect(() => {
    const initialHistory = [];
    const now = Date.now();
    for (let i = 10; i >= 0; i--) {
      initialHistory.push({
        time: now - i * 60000, // 每分钟一个点
        cpu: 40 + Math.random() * 20,
        memory: 50 + Math.random() * 30,
        messages: 5 + Math.random() * 15,
      });
    }
    setPerformanceHistory(initialHistory);
  }, []);

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      // 更新系统指标
      setSystemMetrics(prev => ({
        cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(85, prev.memoryUsage + (Math.random() - 0.3) * 5)),
        networkLatency: Math.max(10, Math.min(50, prev.networkLatency + (Math.random() - 0.5) * 5)),
        messageRate: Math.max(5, Math.min(25, prev.messageRate + (Math.random() - 0.5) * 3)),
        errorRate: Math.max(0, Math.min(2, prev.errorRate + (Math.random() - 0.5) * 0.3)),
        uptime: prev.uptime + 1,
      }));

      // 更新性能历史
      setPerformanceHistory(prev => {
        const newHistory = [...prev.slice(-9), {
          time: Date.now(),
          cpu: systemMetrics.cpuUsage,
          memory: systemMetrics.memoryUsage,
          messages: systemMetrics.messageRate,
        }];
        return newHistory;
      });

      // 随机生成警报
      if (Math.random() < 0.05) { // 5%概率生成警报
        const alertTypes = [
          { type: 'warning', message: 'CPU使用率偏高', metric: 'cpu' },
          { type: 'info', message: '新用户连接', metric: 'connections' },
          { type: 'success', message: '任务批量完成', metric: 'tasks' },
        ];
        const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        
        setAlerts(prev => [{
          id: `alert_${Date.now()}`,
          type: alert.type,
          message: alert.message,
          timestamp: Date.now(),
          metric: alert.metric,
        }, ...prev.slice(0, 4)]);
      }

      setLastUpdate(Date.now());
    }, 3000); // 每3秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 获取智能体性能统计
  const getAgentPerformance = () => {
    const workingAgents = agents.filter(a => a.status === 'working' || a.status === 'online');
    const completedTasks = agents.filter(a => a.progress === 100).length;
    
    return {
      activeAgents: workingAgents.length,
      avgProgress: agents.reduce((sum, a) => sum + a.progress, 0) / agents.length,
      completedTasks,
      responseTime: workingAgents.length > 0 ? 1200 : 0, // 模拟响应时间
    };
  };

  // 获取系统健康状态
  const getSystemHealth = () => {
    const { cpuUsage, memoryUsage, errorRate } = systemMetrics;
    
    if (cpuUsage > 80 || memoryUsage > 85 || errorRate > 1) {
      return { status: 'critical', color: 'text-red-500', bg: 'bg-red-100' };
    } else if (cpuUsage > 60 || memoryUsage > 70 || errorRate > 0.5) {
      return { status: 'warning', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    } else {
      return { status: 'healthy', color: 'text-green-500', bg: 'bg-green-100' };
    }
  };

  // 格式化运行时间
  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // 获取指标颜色
  const getMetricColor = (value, thresholds) => {
    if (value >= thresholds.critical) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  // 获取进度条颜色
  const getProgressColor = (value) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const agentPerformance = getAgentPerformance();
  const systemHealth = getSystemHealth();

  return (
    <div className="card-delicate">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rough-blue" />
          <h2 className="text-lg font-semibold">实时监控</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-charcoal/50">
            最后更新: {new Date(lastUpdate).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
          </span>
          <button className="p-1 hover:bg-charcoal/5 rounded transition-colors">
            <RefreshCw className="w-4 h-4 text-charcoal/60" />
          </button>
        </div>
      </div>

      {/* 系统健康状态 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">系统健康状态</span>
          <span className={`px-2 py-1 rounded text-xs ${systemHealth.bg} ${systemHealth.color}`}>
            {systemHealth.status === 'healthy' && '健康'}
            {systemHealth.status === 'warning' && '警告'}
            {systemHealth.status === 'critical' && '严重'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-charcoal/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-charcoal/60">CPU使用率</span>
              <span className={`text-sm font-medium ${getMetricColor(systemMetrics.cpuUsage, { warning: 60, critical: 80 })}`}>
                {systemMetrics.cpuUsage.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getProgressColor(systemMetrics.cpuUsage)}`}
                style={{ width: `${systemMetrics.cpuUsage}%` }}
              />
            </div>
          </div>
          
          <div className="p-3 bg-charcoal/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-charcoal/60">内存使用</span>
              <span className={`text-sm font-medium ${getMetricColor(systemMetrics.memoryUsage, { warning: 70, critical: 85 })}`}>
                {systemMetrics.memoryUsage.toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getProgressColor(systemMetrics.memoryUsage)}`}
                style={{ width: `${systemMetrics.memoryUsage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 性能指标 */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-3">性能指标</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-charcoal/5 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-charcoal/60">消息速率</span>
            </div>
            <div className="text-xl font-bold">{systemMetrics.messageRate.toFixed(1)}/秒</div>
          </div>
          
          <div className="p-3 bg-charcoal/5 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-charcoal/60">网络延迟</span>
            </div>
            <div className="text-xl font-bold">{systemMetrics.networkLatency.toFixed(0)}ms</div>
          </div>
        </div>
      </div>

      {/* 智能体性能 */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-3">智能体性能</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal/60">活跃智能体</span>
            <span className="font-medium">{agentPerformance.activeAgents}/{agents.length}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal/60">平均进度</span>
            <span className="font-medium">{agentPerformance.avgProgress.toFixed(1)}%</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal/60">已完成任务</span>
            <span className="font-medium">{agentPerformance.completedTasks}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal/60">平均响应时间</span>
            <span className="font-medium">{agentPerformance.responseTime}ms</span>
          </div>
        </div>
      </div>

      {/* 系统信息 */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-3">系统信息</div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/60">运行时间</span>
            <span>{formatUptime(systemMetrics.uptime)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/60">错误率</span>
            <span className={getMetricColor(systemMetrics.errorRate, { warning: 0.5, critical: 1 })}>
              {systemMetrics.errorRate.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/60">连接数</span>
            <span>1</span> {/* 模拟当前用户连接数 */}
          </div>
        </div>
      </div>

      {/* 实时警报 */}
      {alerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium">实时警报</span>
            </div>
            <button
              onClick={() => setAlerts([])}
              className="text-xs text-charcoal/50 hover:text-charcoal"
            >
              清空
            </button>
          </div>
          
          <div className="space-y-2">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-2 rounded text-sm ${
                  alert.type === 'warning' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                  alert.type === 'critical' ? 'bg-red-50 text-red-700 border border-red-200' :
                  alert.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                  'bg-blue-50 text-blue-700 border border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  <span className="text-xs opacity-70">
                    {new Date(alert.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 性能图表预览 */}
      <div className="mt-4 pt-4 border-t border-charcoal/10">
        <div className="text-sm font-medium mb-2">CPU使用趋势</div>
        <div className="h-20 relative">
          <div className="absolute inset-0 flex items-end">
            {performanceHistory.slice(-10).map((point, index) => {
              const maxCpu = Math.max(...performanceHistory.map(p => p.cpu));
              const height = (point.cpu / maxCpu) * 100;
              
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center"
                  style={{ marginRight: '2px' }}
                >
                  <div
                    className={`w-full ${getProgressColor(point.cpu)} rounded-t`}
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-charcoal/40 mt-1">
                    {new Date(point.time).getMinutes()}'
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}