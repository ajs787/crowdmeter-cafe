import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🚀 Starting CrowdMeter Development Environment...\n');

// Start the Flask populartimes server
console.log('🐍 Starting Flask populartimes server...');
const flaskServer = spawn('python3', ['app.py'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
  cwd: process.cwd()
});

flaskServer.stdout.on('data', (data) => {
  console.log(`[Flask] ${data}`);
});

flaskServer.stderr.on('data', (data) => {
  console.log(`[Flask Error] ${data}`);
});

// Start the backend server
console.log('⚡ Starting Node.js backend server...');
const server = spawn('node', ['server/index.js'], {
  stdio: ['inherit', 'inherit', 'inherit'],
  shell: true,
  cwd: process.cwd()
});

// Wait for servers to start
await setTimeout(5000);

console.log('\nSeeding cafe data...');
try {
  const seedResponse = await fetch('http://localhost:5175/api/cafes/seed', {
    method: 'POST'
  });
  const seedResult = await seedResponse.json();
  console.log('✅ Seed result:', seedResult);
} catch (error) {
  console.log('❌ Seed failed:', error.message);
}

// Wait a bit more
await setTimeout(2000);

console.log('\nRefreshing live popularity data...');
try {
  const refreshResponse = await fetch('http://localhost:5175/api/cafes/refresh', {
    method: 'POST'
  });
  const refreshResult = await refreshResponse.json();
  console.log(' Refresh result:', refreshResult);
} catch (error) {
  console.log(' Refresh failed:', error.message);
}

// Smart scheduling function - refresh more during peak cafe hours
function getRefreshInterval() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Weekend hours (Saturday & Sunday)
  if (day === 0 || day === 6) {
    if (hour >= 8 && hour <= 18) return 2 * 60 * 1000; // 2 minutes during weekend day
    return 8 * 60 * 1000; // 8 minutes during weekend night
  }
  
  // Weekday peak hours
  if (hour >= 7 && hour <= 10) return 90 * 1000; // 1.5 minutes during morning rush
  if (hour >= 11 && hour <= 14) return 2 * 60 * 1000; // 2 minutes during lunch
  if (hour >= 15 && hour <= 18) return 3 * 60 * 1000; // 3 minutes during afternoon
  if (hour >= 19 && hour <= 22) return 4 * 60 * 1000; // 4 minutes during evening study
  
  // Off-peak hours (late night/early morning)
  return 10 * 60 * 1000; // 10 minutes during quiet hours
}

function getTimeDescription() {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  if (day === 0 || day === 6) {
    if (hour >= 8 && hour <= 18) return "weekend day (2min)";
    return "weekend night (8min)";
  }
  
  if (hour >= 7 && hour <= 10) return "morning rush (1.5min)";
  if (hour >= 11 && hour <= 14) return "lunch time (2min)";
  if (hour >= 15 && hour <= 18) return "afternoon (3min)";
  if (hour >= 19 && hour <= 22) return "evening study (4min)";
  return "quiet hours (10min)";
}

console.log('\nSetup complete! Your backend is running with fresh data.');
console.log('🌐 Backend: http://localhost:5175');
console.log('📊 API: http://localhost:5175/api/cafes');
console.log('⏰ Smart scheduling enabled - refresh frequency adapts to peak hours\n');

// Smart auto-refresh with adaptive intervals
let refreshTimeout;

async function scheduleNextRefresh() {
  const interval = getRefreshInterval();
  const description = getTimeDescription();
  const nextRefresh = new Date(Date.now() + interval);
  
  console.log(`📅 Next refresh in ${interval/1000/60} minutes (${description}) at ${nextRefresh.toLocaleTimeString()}`);
  
  refreshTimeout = setTimeout(async () => {
    const now = new Date().toLocaleTimeString();
    console.log(`\n🔄 [${now}] Auto-refreshing popularity data (${description})...`);
    
    try {
      const refreshResponse = await fetch('http://localhost:5175/api/cafes/refresh', {
        method: 'POST'
      });
      const refreshResult = await refreshResponse.json();
      console.log(`✅ [${now}] Refresh completed:`, refreshResult);
    } catch (error) {
      console.log(`❌ [${now}] Refresh failed:`, error.message);
    }
    
    // Schedule the next refresh
    scheduleNextRefresh();
  }, interval);
}

// Start the smart scheduling
scheduleNextRefresh();

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  clearTimeout(refreshTimeout);
  server.kill();
  flaskServer.kill();
  process.exit(0);
});

// Keep script running
await new Promise(() => {});