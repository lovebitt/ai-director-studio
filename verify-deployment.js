// AI导演智能工作室 - 部署验证脚本
// 用于全面验证Vercel部署的功能完整性

const https = require('https');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const BASE_URL = 'https://lovebitt-ai-director-studio-fv6g.vercel.app';
const PAGES_TO_CHECK = [
  { path: '/', name: '首页', expectedTitle: 'AI导演工作室' },
  { path: '/studio', name: '智能工作室', expectedTitle: 'AI导演智能工作室' },
  { path: '/test-version.html', name: '测试页面', expectedTitle: 'AI导演智能工作室 - 版本测试' },
  { path: '/api/socket/io', name: 'WebSocket API', method: 'POST' }
];

async function checkPage(url, options = {}) {
  return new Promise((resolve) => {
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'AI-Director-Deployment-Checker/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        error: error.message,
        url: url
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        error: '请求超时',
        url: url
      });
    });

    req.end();
  });
}

async function checkTitle(html, expectedTitle) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch) return { found: false, actual: null };
  
  const actualTitle = titleMatch[1].trim();
  return {
    found: true,
    actual: actualTitle,
    matches: actualTitle.includes(expectedTitle)
  };
}

async function checkStudioFeatures(html) {
  const checks = {
    hasSocketIO: html.includes('socket.io') || html.includes('WebSocket'),
    hasAgentList: html.includes('智能体') || html.includes('agent'),
    hasChatWindow: html.includes('聊天') || html.includes('chat'),
    hasTaskManager: html.includes('任务') || html.includes('task'),
    hasMonitor: html.includes('监控') || html.includes('monitor')
  };
  
  return checks;
}

async function main() {
  console.log('🎬 AI导演智能工作室 - 全面部署验证');
  console.log('=' .repeat(50));
  console.log(`🔗 基础URL: ${BASE_URL}`);
  console.log(`🕐 检查时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`);
  console.log('');
  
  const results = [];
  let passed = 0;
  let failed = 0;
  let warnings = 0;

  // 检查所有页面
  for (const page of PAGES_TO_CHECK) {
    const url = `${BASE_URL}${page.path}`;
    console.log(`🔍 检查 ${page.name} (${url})...`);
    
    const result = await checkPage(url, { method: page.method });
    
    if (result.error) {
      console.log(`   ❌ 错误: ${result.error}`);
      results.push({ page: page.name, status: 'error', details: result.error });
      failed++;
      continue;
    }
    
    const status = result.statusCode;
    const isSuccess = status >= 200 && status < 400;
    
    if (isSuccess) {
      console.log(`   ✅ HTTP ${status}`);
      
      // 检查页面标题（如果适用）
      if (page.expectedTitle && result.body) {
        const titleCheck = await checkTitle(result.body, page.expectedTitle);
        if (titleCheck.found) {
          if (titleCheck.matches) {
            console.log(`   ✅ 标题匹配: "${titleCheck.actual}"`);
          } else {
            console.log(`   ⚠️  标题不匹配: "${titleCheck.actual}" (期望包含: "${page.expectedTitle}")`);
            warnings++;
          }
        }
      }
      
      // 检查智能工作室功能
      if (page.path === '/studio' && result.body) {
        const featureCheck = await checkStudioFeatures(result.body);
        const featureCount = Object.values(featureCheck).filter(v => v).length;
        console.log(`   📊 功能检测: ${featureCount}/5 个关键功能`);
        
        if (featureCount < 3) {
          console.log(`   ⚠️  功能可能不完整`);
          warnings++;
        }
      }
      
      results.push({ page: page.name, status: 'success', details: `HTTP ${status}` });
      passed++;
    } else if (status === 404) {
      console.log(`   ⚠️  HTTP ${status} (页面可能尚未部署)`);
      results.push({ page: page.name, status: 'warning', details: `HTTP ${status} - 可能尚未部署` });
      warnings++;
    } else {
      console.log(`   ❌ HTTP ${status}`);
      results.push({ page: page.name, status: 'error', details: `HTTP ${status}` });
      failed++;
    }
    
    // 添加一点延迟，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('');
  console.log('=' .repeat(50));
  console.log('📊 验证结果汇总');
  console.log('=' .repeat(50));
  
  console.log(`✅ 通过: ${passed}`);
  console.log(`⚠️  警告: ${warnings}`);
  console.log(`❌ 失败: ${failed}`);
  console.log('');
  
  // 详细结果
  console.log('详细结果:');
  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️ ' : '❌';
    console.log(`  ${icon} ${result.page}: ${result.details}`);
  });
  
  console.log('');
  console.log('=' .repeat(50));
  
  // 提供建议
  if (failed === 0 && warnings === 0) {
    console.log('🎉 完美！所有检查都通过！');
    console.log('');
    console.log('🚀 下一步:');
    console.log('  1. 访问智能工作室: https://lovebitt-ai-director-studio-fv6g.vercel.app/studio');
    console.log('  2. 测试实时聊天功能');
    console.log('  3. 验证任务管理系统');
    console.log('  4. 检查实时监控面板');
  } else if (failed === 0) {
    console.log('👍 基本功能正常，但有警告需要关注');
    console.log('');
    console.log('🔧 建议:');
    console.log('  1. 检查Vercel部署日志');
    console.log('  2. 验证GitHub推送是否成功');
    console.log('  3. 等待几分钟后重新检查');
    console.log('  4. 手动触发Vercel重新部署');
  } else {
    console.log('🚨 有严重问题需要解决');
    console.log('');
    console.log('🛠️ 紧急行动:');
    console.log('  1. 检查Vercel构建日志');
    console.log('  2. 验证代码是否有构建错误');
    console.log('  3. 检查GitHub仓库状态');
    console.log('  4. 可能需要手动修复和重新部署');
  }
  
  console.log('');
  console.log('🔗 相关链接:');
  console.log('  • Vercel项目: https://vercel.com/dashboard');
  console.log('  • GitHub仓库: https://github.com/lovebitt/ai-director-studio');
  console.log('  • 智能工作室: https://lovebitt-ai-director-studio-fv6g.vercel.app/studio');
  console.log('  • 测试页面: https://lovebitt-ai-director-studio-fv6g.vercel.app/test-version.html');
  
  console.log('');
  console.log('🎬 验证完成时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
}

// 运行验证
main().catch(error => {
  console.error('验证过程中出错:', error);
  process.exit(1);
});