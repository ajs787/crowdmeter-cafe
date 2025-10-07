import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('Starting CrowdMeter Development Environment...\n');

// Start the backend server
const server = spawn('npm', ['run', 'dev'], {
  stdio: ['inherit', 'inherit', 'inherit'],
  shell: true
});

// Wait for server to start
await setTimeout(3000);

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

console.log('\nSetup complete! Your backend is running with fresh data.');
console.log('Backend: http://localhost:5175');
console.log('API: http://localhost:5175/api/cafes');
console.log('Auto-refreshing popularity data every 7 minutes...\n');

// Set up auto-refresh every 7 minutes
const refreshInterval = setInterval(async () => {
  const now = new Date().toLocaleTimeString();
  console.log(`\n [${now}] Auto-refreshing popularity data...`);
  
  try {
    const refreshResponse = await fetch('http://localhost:5175/api/cafes/refresh', {
      method: 'POST'
    });
    const refreshResult = await refreshResponse.json();
    console.log(`✅ [${now}] Refresh completed:`, refreshResult);
  } catch (error) {
    console.log(`❌ [${now}] Refresh failed:`, error.message);
  }
}, 7 * 60 * 1000); // 7 minutes in milliseconds

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n Shutting down...');
  clearInterval(refreshInterval);
  server.kill();
  process.exit(0);
});

// Keep script running
await new Promise(() => {});