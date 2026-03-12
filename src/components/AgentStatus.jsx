import { motion } from 'framer-motion';
import { Palette, Cpu, Users, CheckCircle, Clock, Zap } from 'lucide-react';

const agents = [
  {
    id: 'visual',
    name: '视觉风格智能体',
    icon: Palette,
    status: 'working',
    progress: 50,
    currentTask: '收集粗粝细腻主义参考图',
    details: '25/50张参考图已收集',
    estimatedCompletion: '13:30',
    color: 'rough-blue',
  },
  {
    id: 'dreamai',
    name: '即梦AI专家智能体',
    icon: Cpu,
    status: 'completed',
    progress: 100,
    currentTask: '设计提示词变体',
    details: '10/10种变体已完成',
    completedAt: '12:30',
    color: 'misty-purple',
  },
  {
    id: 'main',
    name: '主智能体',
    icon: Users,
    status: 'coordinating',
    progress: 100,
    currentTask: '系统协调与监控',
    details: '协调2个智能体，监控13个任务',
    systemHealth: '正常',
    color: 'sage-green',
  },
];

export default function AgentStatus() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-paper-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="title-rough mb-4">多智能体工作状态</h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            实时监控AI导演系统的智能体团队工作进展，每个智能体专注不同领域，协同完成创作任务。
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-delicate"
            >
              {/* 智能体头部 */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${agent.color}/10`}>
                    <agent.icon className={`w-6 h-6 text-${agent.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal">
                      {agent.name}
                    </h3>
                    <div className={`status-indicator status-${agent.status}`}>
                      {agent.status === 'working' && (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>工作中</span>
                        </>
                      )}
                      {agent.status === 'completed' && (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>任务完成</span>
                        </>
                      )}
                      {agent.status === 'coordinating' && (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>协调中</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 进度条 */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-charcoal/70 mb-2">
                  <span>任务进度</span>
                  <span>{agent.progress}%</span>
                </div>
                <div className="progress-bar-rough">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${agent.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="progress-fill"
                  />
                </div>
              </div>
              
              {/* 任务详情 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-charcoal/60">当前任务</span>
                  <span className="text-sm font-medium">{agent.currentTask}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-charcoal/60">详情</span>
                  <span className="text-sm">{agent.details}</span>
                </div>
                
                {agent.estimatedCompletion && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-charcoal/60">预计完成</span>
                    <span className="text-sm font-medium">{agent.estimatedCompletion}</span>
                  </div>
                )}
                
                {agent.completedAt && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-charcoal/60">完成时间</span>
                    <span className="text-sm font-medium">{agent.completedAt}</span>
                  </div>
                )}
                
                {agent.systemHealth && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-charcoal/60">系统健康</span>
                    <span className="text-sm font-medium text-green-600">
                      {agent.systemHealth}
                    </span>
                  </div>
                )}
              </div>
              
              {/* 装饰边框 */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${agent.color} to-transparent`} />
            </motion.div>
          ))}
        </div>
        
        {/* 系统概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 card-rough"
        >
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-rough-blue">3小时</div>
              <div className="text-sm text-charcoal/60 mt-1">系统运行时间</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-misty-purple">6/13</div>
              <div className="text-sm text-charcoal/60 mt-1">任务完成率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sage-green">46%</div>
              <div className="text-sm text-charcoal/60 mt-1">整体进度</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-dusty-pink">15项</div>
              <div className="text-sm text-charcoal/60 mt-1">今日产出</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}