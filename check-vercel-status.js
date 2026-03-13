// Vercel部署状态检查脚本
const https = require('https');

const urls = [
  'https://lovebitt-ai-director-studio-fv6g.vercel.app/',
  'https://lovebitt-ai-director-studio-fv6g.vercel.app/studio',
  'https://lovebitt-ai-director-studio-fv6g.vercel.app/connection-test',
  'https://lovebitt-ai-director-studio-fv6g.vercel.app/fix-websocket.html',
  'https://lovebitt-ai-director-studio-fv6g.vercel.app/api/socket/io'
];

console.log('🔍 检查Vercel部署状态...\n');

urls.forEach(url => {
  https.get(url, (res) => {
    const age = res.headers['age'] || 'unknown';
    const cacheControl = res.headers['cache-control'] || 'unknown';
    const status = res.statusCode;
    
    console.log(`📄 ${url}`);
    console.log(`  状态: ${status} | 缓存时间: ${age}秒 | 缓存控制: ${cacheControl}`);
    
    // 检查内容是否包含最新功能
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      if (url.includes('studio') && data.includes('ConnectionDiagnostic')) {
        console.log('   ✅ 包含最新诊断工具');
      } else if (url.includes('studio') && !data.includes('ConnectionDiagnostic')) {
        console.log('   ❌ 不包含最新诊断工具');
      }
      console.log('');
    });
  }).on('error', (err) => {
    console.log(`📄 ${url}`);
    console.log(`   ❌ 错误: ${err.message}\n`);
  });
});

// 延迟执行以收集所有结果
setTimeout(() => {
  console.log('📊 分析总结:');
  console.log('1. 如果缓存时间(age) > 300秒，说明Vercel可能没有部署最新版本');
  console.log('2. 如果studio页面不包含ConnectionDiagnostic，说明部署的是旧版本');
  console.log('3. 建议: 手动触发Vercel重新部署或等待缓存过期');
}, 3000);