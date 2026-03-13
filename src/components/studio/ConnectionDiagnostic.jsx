import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, CheckCircle, Wifi, WifiOff } from '../SimpleIcons';

export default function ConnectionDiagnostic({ socketClient }) {
  const [diagnostics, setDiagnostics] = useState({
    pageLoaded: false,
    socketInitialized: false,
    socketConnected: false,
    apiAccessible: false,
    agentsOnline: false,
    errors: []
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // 标记页面已加载
    setDiagnostics(prev => ({ ...prev, pageLoaded: true }));

    // 检查Socket客户端
    if (socketClient) {
      setDiagnostics(prev => ({ ...prev, socketInitialized: true }));
      
      // 监听连接状态
      const handleConnectionStatus = (data) => {
        setDiagnostics(prev => ({ 
          ...prev, 
          socketConnected: data.connected,
          agentsOnline: data.connected
        }));
      };

      const handleConnectionError = (error) => {
        setDiagnostics(prev => ({
          ...prev,
          errors: [...prev.errors, `连接错误: ${error.message || error}`]
        }));
      };

      socketClient.on('connection_status', handleConnectionStatus);
      socketClient.on('connection_error', handleConnectionError);

      // 测试API可访问性
      testAPIAccessibility();

      return () => {
        socketClient.off('connection_status', handleConnectionStatus);
        socketClient.off('connection_error', handleConnectionError);
      };
    } else {
      setDiagnostics(prev => ({
        ...prev,
        errors: ['Socket客户端未初始化']
      }));
    }
  }, [socketClient]);

  const testAPIAccessibility = async () => {
    try {
      const response = await fetch('/api/socket/io', { method: 'GET' });
      setDiagnostics(prev => ({ 
        ...prev, 
        apiAccessible: response.status === 405 // 405是正常的，表示API存在
      }));
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        apiAccessible: false,
        errors: [...prev.errors, `API访问失败: ${error.message}`]
      }));
    }
  };

  const getConnectionStatus = () => {
    const { socketConnected, apiAccessible } = diagnostics;
    
    if (socketConnected && apiAccessible) {
      return { status: 'connected', text: '已连接', color: 'text-green-500', bg: 'bg-green-100' };
    } else if (apiAccessible && !socketConnected) {
      return { status: 'connecting', text: '连接中...', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    } else if (!apiAccessible) {
      return { status: 'error', text: '连接错误', color: 'text-red-500', bg: 'bg-red-100' };
    } else {
      return { status: 'unknown', text: '未知状态', color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  const runDiagnostics = () => {
    const newDiagnostics = { ...diagnostics };
    
    // 检查window对象
    if (typeof window === 'undefined') {
      newDiagnostics.errors.push('不在浏览器环境中');
    } else {
      newDiagnostics.errors.push('在浏览器环境中 ✓');
    }

    // 检查WebSocket支持
    if (typeof WebSocket === 'undefined') {
      newDiagnostics.errors.push('浏览器不支持WebSocket');
    } else {
      newDiagnostics.errors.push('浏览器支持WebSocket ✓');
    }

    // 检查当前URL
    if (typeof window !== 'undefined') {
      newDiagnostics.errors.push(`当前URL: ${window.location.href}`);
    }

    setDiagnostics(newDiagnostics);
    setShowDetails(true);
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-charcoal/10 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity />
            <span className="font-medium">连接诊断</span>
          </div>
          <div className={`px-2 py-1 rounded text-xs ${connectionStatus.bg} ${connectionStatus.color}`}>
            {connectionStatus.text}
          </div>
        </div>

        {/* 状态概览 */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/70">页面加载</span>
            <span className={diagnostics.pageLoaded ? 'text-green-500' : 'text-red-500'}>
              {diagnostics.pageLoaded ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/70">Socket初始化</span>
            <span className={diagnostics.socketInitialized ? 'text-green-500' : 'text-red-500'}>
              {diagnostics.socketInitialized ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/70">API可访问</span>
            <span className={diagnostics.apiAccessible ? 'text-green-500' : 'text-red-500'}>
              {diagnostics.apiAccessible ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-charcoal/70">Socket连接</span>
            <span className={diagnostics.socketConnected ? 'text-green-500' : 'text-red-500'}>
              {diagnostics.socketConnected ? '✓' : '✗'}
            </span>
          </div>
        </div>

        {/* 错误信息 */}
        {diagnostics.errors.length > 0 && showDetails && (
          <div className="mb-4">
            <div className="text-sm font-medium text-charcoal/70 mb-2">诊断信息:</div>
            <div className="max-h-32 overflow-y-auto text-xs space-y-1">
              {diagnostics.errors.map((error, index) => (
                <div key={index} className="p-2 bg-charcoal/5 rounded">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={runDiagnostics}
            className="flex-1 py-2 bg-rough-blue text-white rounded text-sm hover:bg-rough-blue/90 transition-colors"
          >
            运行诊断
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-2 bg-charcoal/10 text-charcoal rounded text-sm hover:bg-charcoal/20 transition-colors"
          >
            刷新页面
          </button>
        </div>

        {/* 快速修复建议 */}
        {connectionStatus.status === 'error' && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertTriangle />
              <span className="font-medium">快速修复:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-red-600">
              <li>点击"刷新页面"按钮</li>
              <li>检查浏览器控制台错误 (F12 → Console)</li>
              <li>确保网络连接正常</li>
              <li>尝试清除浏览器缓存</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}