import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Activity, Wifi, WifiOff, CheckCircle, XCircle, RefreshCw } from '../components/SimpleIcons';

export default function ConnectionTest() {
  const [tests, setTests] = useState([
    { id: 'page_load', name: '页面加载', status: 'pending', message: '等待测试...' },
    { id: 'api_check', name: 'API端点检查', status: 'pending', message: '等待测试...' },
    { id: 'websocket_test', name: 'WebSocket连接', status: 'pending', message: '等待测试...' },
    { id: 'agents_status', name: '智能体状态', status: 'pending', message: '等待测试...' },
  ]);

  const [overallStatus, setOverallStatus] = useState('testing');
  const [details, setDetails] = useState([]);

  useEffect(() => {
    // 标记页面已加载
    updateTest('page_load', 'success', '页面加载成功');

    // 运行API测试
    testAPIEndpoint();

    // 运行WebSocket测试
    testWebSocket();

    // 运行智能体状态测试
    testAgentsStatus();
  }, []);

  const updateTest = (id, status, message) => {
    setTests(prev => prev.map(test => 
      test.id === id ? { ...test, status, message } : test
    ));
    setDetails(prev => [...prev, `${new Date().toLocaleTimeString()}: ${id} - ${message}`]);
  };

  const testAPIEndpoint = async () => {
    updateTest('api_check', 'testing', '正在检查API端点...');
    
    try {
      const response = await fetch('/api/socket/io', { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.status === 405) {
        updateTest('api_check', 'success', 'API端点正常 (405 Method Not Allowed是预期的)');
      } else {
        updateTest('api_check', 'warning', `API返回状态: ${response.status}`);
      }
    } catch (error) {
      updateTest('api_check', 'error', `API检查失败: ${error.message}`);
    }
  };

  const testWebSocket = () => {
    updateTest('websocket_test', 'testing', '正在测试WebSocket连接...');
    
    try {
      // 创建简单的WebSocket测试
      const socketUrl = window.location.origin.replace('http', 'ws') + '/api/socket/io';
      const testSocket = new WebSocket(socketUrl);
      
      testSocket.onopen = () => {
        updateTest('websocket_test', 'success', 'WebSocket连接成功');
        testSocket.close();
      };
      
      testSocket.onerror = (error) => {
        updateTest('websocket_test', 'error', `WebSocket连接错误: ${error.type}`);
      };
      
      testSocket.onclose = () => {
        // 正常关闭
      };
      
      // 设置超时
      setTimeout(() => {
        if (testSocket.readyState !== WebSocket.OPEN) {
          updateTest('websocket_test', 'error', 'WebSocket连接超时');
          testSocket.close();
        }
      }, 5000);
      
    } catch (error) {
      updateTest('websocket_test', 'error', `WebSocket测试异常: ${error.message}`);
    }
  };

  const testAgentsStatus = async () => {
    updateTest('agents_status', 'testing', '正在检查智能体状态...');
    
    // 模拟智能体状态检查
    setTimeout(() => {
      updateTest('agents_status', 'success', '智能体系统就绪 (模拟)');
    }, 2000);
  };

  const runAllTests = () => {
    setTests(tests.map(test => ({ ...test, status: 'pending', message: '等待测试...' })));
    setDetails([]);
    setOverallStatus('testing');
    
    // 重新运行测试
    testAPIEndpoint();
    testWebSocket();
    testAgentsStatus();
  };

  // 计算总体状态
  useEffect(() => {
    const failedTests = tests.filter(t => t.status === 'error').length;
    const pendingTests = tests.filter(t => t.status === 'pending' || t.status === 'testing').length;
    
    if (failedTests > 0) {
      setOverallStatus('error');
    } else if (pendingTests > 0) {
      setOverallStatus('testing');
    } else {
      setOverallStatus('success');
    }
  }, [tests]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-100';
      case 'error': return 'text-red-500 bg-red-100';
      case 'warning': return 'text-yellow-500 bg-yellow-100';
      case 'testing': return 'text-blue-500 bg-blue-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle />;
      case 'error': return <XCircle />;
      case 'warning': return <Activity />;
      case 'testing': return <RefreshCw />;
      default: return <Activity />;
    }
  };

  const getOverallStatusInfo = () => {
    switch (overallStatus) {
      case 'success':
        return { 
          title: '所有测试通过！', 
          message: '智能工作室连接正常，可以开始使用。',
          color: 'text-green-500',
          bg: 'bg-green-50',
          border: 'border-green-200'
        };
      case 'error':
        return { 
          title: '连接测试失败', 
          message: '部分测试未通过，需要修复连接问题。',
          color: 'text-red-500',
          bg: 'bg-red-50',
          border: 'border-red-200'
        };
      case 'testing':
        return { 
          title: '测试进行中...', 
          message: '正在检查系统连接状态。',
          color: 'text-blue-500',
          bg: 'bg-blue-50',
          border: 'border-blue-200'
        };
      default:
        return { 
          title: '连接状态未知', 
          message: '无法确定当前连接状态。',
          color: 'text-gray-500',
          bg: 'bg-gray-50',
          border: 'border-gray-200'
        };
    }
  };

  const overallInfo = getOverallStatusInfo();

  return (
    <>
      <Head>
        <title>智能工作室 - 连接测试</title>
        <meta name="description" content="AI导演智能工作室连接测试页面" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gradient-to-b from-charcoal/5 to-white pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* 标题区域 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-charcoal">连接诊断</span>
              <span className="text-rough-blue"> · 系统测试</span>
            </h1>
            <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
              全面检测智能工作室的连接状态，识别并解决网络和WebSocket问题。
            </p>
          </div>

          {/* 总体状态 */}
          <div className={`mb-8 p-6 rounded-xl ${overallInfo.bg} border ${overallInfo.border}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${overallInfo.color} mb-2`}>
                  {overallInfo.title}
                </h2>
                <p className="text-charcoal/70">{overallInfo.message}</p>
              </div>
              <div className="text-4xl">
                {overallStatus === 'success' ? '🎉' : 
                 overallStatus === 'error' ? '⚠️' : 
                 overallStatus === 'testing' ? '🔍' : '❓'}
              </div>
            </div>
          </div>

          {/* 测试结果网格 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {tests.map((test) => (
              <div key={test.id} className="card-delicate">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getStatusColor(test.status)}`}>
                      {getStatusIcon(test.status)}
                    </div>
                    <h3 className="text-lg font-semibold">{test.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(test.status)}`}>
                    {test.status === 'success' ? '通过' :
                     test.status === 'error' ? '失败' :
                     test.status === 'warning' ? '警告' : '测试中'}
                  </span>
                </div>
                <p className="text-charcoal/70">{test.message}</p>
              </div>
            ))}
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={runAllTests}
              className="px-6 py-3 bg-rough-blue text-white rounded-lg hover:bg-rough-blue/90 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw />
              重新运行所有测试
            </button>
            <a
              href="/studio"
              className="px-6 py-3 bg-charcoal/10 text-charcoal rounded-lg hover:bg-charcoal/20 transition-colors text-center"
            >
              返回智能工作室
            </a>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-misty-purple/10 text-misty-purple rounded-lg hover:bg-misty-purple/20 transition-colors"
            >
              刷新页面
            </button>
          </div>

          {/* 详细日志 */}
          <div className="card-delicate">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity />
              测试详细日志
            </h3>
            <div className="max-h-64 overflow-y-auto">
              {details.length === 0 ? (
                <p className="text-charcoal/50 text-center py-8">暂无日志记录</p>
              ) : (
                <div className="space-y-2">
                  {details.map((detail, index) => (
                    <div key={index} className="p-3 bg-charcoal/5 rounded text-sm font-mono">
                      {detail}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 故障排除指南 */}
          {overallStatus === 'error' && (
            <div className="mt-8 card-delicate border-2 border-red-200">
              <h3 className="text-lg font-semibold mb-4 text-red-600 flex items-center gap-2">
                <XCircle />
                故障排除指南
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">1. 检查网络连接</h4>
                  <ul className="list-disc list-inside text-charcoal/70 space-y-1">
                    <li>确保您的设备已连接到互联网</li>
                    <li>尝试访问其他网站确认网络正常</li>
                    <li>检查防火墙或代理设置</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">2. 浏览器相关问题</h4>
                  <ul className="list-disc list-inside text-charcoal/70 space-y-1">
                    <li>尝试使用Chrome、Firefox或Edge浏览器</li>
                    <li>清除浏览器缓存和Cookie</li>
                    <li>禁用浏览器扩展程序后重试</li>
                    <li>按F12打开开发者工具，查看Console标签页的错误信息</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">3. 系统相关问题</h4>
                  <ul className="list-disc list-inside text-charcoal/70 space-y-1">
                    <li>确保JavaScript已启用</li>
                    <li>检查浏览器是否支持WebSocket</li>
                    <li>尝试使用隐身/无痕模式访问</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}