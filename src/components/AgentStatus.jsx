import { Palette, Cpu, Users, CheckCircle, Clock, Zap } from '../components/SimpleIcons';

const agents = [
  {
    id: 'visual',
    name: '视觉风格智能体',
    icon: Palette,
    status: 'working',
    progress: 50,
    description: '全风格视觉研究，参考图收集与分析',
    tasks: ['收集参考图', '风格分析', '视觉建议']
  },
  {
    id: 'dreamai',
    name: '即梦AI专家',
    icon: Cpu,
    status: 'online',
    progress: 80,
    description: 'AI生成优化，提示词设计与参数调优',
    tasks: ['提示词优化', '参数调整', '生成评估']
  },
  {
    id: 'narrative',
    name: '总编剧智能体',
    icon: Users,
    status: 'idle',
    progress: 30,
    description: '故事架构与角色设计，剧本创作指导',
    tasks: ['故事构思', '角色设计', '剧本写作']
  },
  {
    id: 'storyboard',
    name: '分镜导演智能体',
    icon: CheckCircle,
    status: 'working',
    progress: 65,
    description: '视觉叙事与镜头语言，分镜脚本设计',
    tasks: ['分镜设计', '节奏控制', '视觉叙事']
  },
  {
    id: 'main',
    name: '主导演智能体',
    icon: Zap,
    status: 'online',
    progress: 90,
    description: '系统协调与决策，任务分配与进度监控',
    tasks: ['任务分配', '进度监控', '冲突解决']
  },
  {
    id: 'coordinator',
    name: '协作协调器',
    icon: Clock,
    status: 'offline',
    progress: 10,
    description: '多智能体协作调度，通信优化',
    tasks: ['协作调度', '通信管理', '效率优化']
  }
];

export default function AgentStatus() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'working': return 'bg-green-100 text-green-700';
      case 'online': return 'bg-blue-100 text-blue-700';
      case 'idle': return 'bg-yellow-100 text-yellow-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'working': return '工作中';
      case 'online': return '在线';
      case 'idle': return '空闲';
      case 'offline': return '离线';
      default: return '未知';
    }
  };

  return (
    <section id="agents" className="py-20 bg-charcoal/5">
      <div className="container mx-auto px-4">
        {/* 标题区域 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-charcoal">智能体团队</span>
            <span className="text-rough-blue"> · 实时状态</span>
          </h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            实时监控AI导演系统的智能体团队工作进展，每个智能体专注不同领域，协同完成创作任务。
          </p>
        </div>

        {/* 智能体网格 */}
        <div className="grid md:grid-cols-3 gap-8">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div key={agent.id} className="card-delicate">
                {/* 智能体头部 */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-charcoal/10 rounded-lg">
                      <Icon />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{agent.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(agent.status)}`}>
                        {getStatusText(agent.status)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{agent.progress}%</div>
                    <div className="text-sm text-charcoal/50">完成度</div>
                  </div>
                </div>

                {/* 描述 */}
                <p className="text-charcoal/70 mb-6">{agent.description}</p>

                {/* 进度条 */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-charcoal/60 mb-2">
                    <span>任务进度</span>
                    <span>{agent.progress}%</span>
                  </div>
                  <div className="h-2 bg-charcoal/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rough-blue to-misty-purple rounded-full transition-all duration-500"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                </div>

                {/* 任务列表 */}
                <div>
                  <h4 className="text-sm font-medium text-charcoal/60 mb-3">当前任务</h4>
                  <div className="space-y-2">
                    {agent.tasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-rough-blue rounded-full" />
                        <span className="text-sm">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 统计信息 */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-rough-blue">{agents.length}</div>
            <div className="text-charcoal/60 mt-2">智能体总数</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-misty-purple">
              {agents.filter(a => a.status === 'working' || a.status === 'online').length}
            </div>
            <div className="text-charcoal/60 mt-2">活跃智能体</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-sage-green">
              {Math.round(agents.reduce((sum, a) => sum + a.progress, 0) / agents.length)}%
            </div>
            <div className="text-charcoal/60 mt-2">平均进度</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="text-3xl font-bold text-dusty-pink">
              {agents.reduce((sum, a) => sum + a.tasks.length, 0)}
            </div>
            <div className="text-charcoal/60 mt-2">总任务数</div>
          </div>
        </div>
      </div>
    </section>
  );
}