// Vercel部署监控脚本
// 实时监控构建状态并提供更新

const https = require('https');
const readline = require('readline');

const DEPLOY_URL = 'https://lovebitt-ai-director-studio-fv6g.vercel.app';
const CHECK_INTERVAL = 30000; // 30秒检查一次
const MAX_CHECKS = 20; // 最多检查20次 (10分钟)

let checkCount = 0;
let deploymentStarted = false;

// 创建命令行界面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function clearLine() {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

async function checkDeployment() {
  return new Promise((resolve) => {
    const req = https.request(DEPLOY_URL + '/test-version.html', {
      method: 'GET',
      timeout: 10000
    }, (res) => {
      resolve({
        status: res.statusCode,
        deployed: res.statusCode === 200,
        timestamp: new Date().toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai' })
      });
    });

    req.on('error', () => {
      resolve({
        status: 0,
        deployed: false,
        timestamp: new Date().toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        error: true
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 0,
        deployed: false,
        timestamp: new Date().toLocaleTimeString('zh-CN', { timeZone: 'Asia/Shanghai' }),
        timeout: true
      });
    });

    req.end();
  });
}

async function checkStudio() {
  return new Promise((resolve) => {
    const req = https.request(DEPLOY_URL + '/studio', {
      method: 'GET',
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const hasStudio = data.includes('智能工作室') || data.includes('studio');
        resolve({
          status: res.statusCode,
          available: res.statusCode === 200 && hasStudio,
          hasContent: hasStudio
        });
      });
    });

    req.on('error', () => resolve({ status: 0, available: false }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, available: false, timeout: true });
    });

    req.end();
  });
}

function displayStatus(status, studioStatus, elapsedSeconds) {
  clearLine();
  
  const timeStr = formatTime(elapsedSeconds);
  const checkStr = `检查 ${checkCount}/${MAX_CHECKS}`;
  
  if (status.deployed && studioStatus.available) {
    console.log(`🎉 ${timeStr} | ${checkStr} | 🟢 部署完成！智能工作室已上线！`);
    return true;
  } else if (status.deployed && !studioStatus.available) {
    console.log(`⚠️  ${timeStr} | ${checkStr} | 🟡 测试页面已部署，但智能工作室尚未就绪`);
  } else if (status.status === 404) {
    console.log(`⏳ ${timeStr} | ${checkStr} | 🟠 等待部署中... (HTTP 404)`);
  } else if (status.error) {
    console.log(`❌ ${timeStr} | ${checkStr} | 🔴 网络错误，无法连接`);
  } else if (status.timeout) {
    console.log(`⌛ ${timeStr} | ${checkStr} | 🟠 请求超时，重试中...`);
  } else {
    console.log(`🔍 ${timeStr} | ${checkStr} | 🟡 检查中... (HTTP ${status.status})`);
  }
  
  return false;
}

async function monitorDeployment() {
  console.log('🎬 Vercel部署监控启动');
  console.log('='.repeat(50));
  console.log(`🔗 部署URL: ${DEPLOY_URL}`);
  console.log(`⏱️  检查间隔: ${CHECK_INTERVAL/1000}秒`);
  console.log(`🕐 开始时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  console.log('='.repeat(50));
  console.log('');
  
  const startTime = Date.now();
  let deploymentComplete = false;
  
  // 监控循环
  while (checkCount < MAX_CHECKS && !deploymentComplete) {
    checkCount++;
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      const [status, studioStatus] = await Promise.all([
        checkDeployment(),
        checkStudio()
      ]);
      
      deploymentComplete = displayStatus(status, studioStatus, elapsedSeconds);
      
      if (deploymentComplete) {
        console.log('');
        console.log('='.repeat(50));
        console.log('🎉 部署成功！');
        console.log('');
        console.log('🚀 立即访问:');
        console.log(`   • 智能工作室: ${DEPLOY_URL}/studio`);
        console.log(`   • 测试页面: ${DEPLOY_URL}/test-version.html`);
        console.log(`   • 首页: ${DEPLOY_URL}/`);
        console.log('');
        console.log('⏱️  总耗时:', formatTime(elapsedSeconds));
        console.log('🕐 完成时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
        console.log('='.repeat(50));
        break;
      }
      
      // 如果不是最后一次检查，等待间隔时间
      if (checkCount < MAX_CHECKS) {
        await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
      }
      
    } catch (error) {
      clearLine();
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      console.log(`❌ ${formatTime(elapsedSeconds)} | 检查 ${checkCount}/${MAX_CHECKS} | 🔴 监控错误: ${error.message}`);
      
      if (checkCount < MAX_CHECKS) {
        await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
      }
    }
  }
  
  if (!deploymentComplete) {
    console.log('');
    console.log('='.repeat(50));
    console.log('⏰ 监控超时');
    console.log('');
    console.log('📊 监控结果:');
    console.log(`   • 检查次数: ${checkCount}`);
    console.log(`   • 总时长: ${formatTime(Math.floor((Date.now() - startTime) / 1000))}`);
    console.log(`   • 最终状态: 部署未完成`);
    console.log('');
    console.log('🔧 建议操作:');
    console.log('   1. 检查Vercel仪表板: https://vercel.com/dashboard');
    console.log('   2. 查看构建日志');
    console.log('   3. 可能需要手动重新部署');
    console.log('='.repeat(50));
  }
  
  rl.close();
}

// 启动监控
monitorDeployment().catch(error => {
  console.error('监控错误:', error);
  rl.close();
  process.exit(1);
});

// 处理Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n🛑 监控已停止');
  rl.close();
  process.exit(0);
});