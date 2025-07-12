// Simple test to check if our routes are accessible
const routes = [
  'http://localhost:5175/',
  'http://localhost:5175/promo-boost',
  'http://localhost:5175/campaigns',
  'http://localhost:5175/submit-school',
  'http://localhost:5175/admin'
];

async function testRoute(url) {
  try {
    const response = await fetch(url);
    const status = response.status;
    console.log(`${url} - Status: ${status} ${status === 200 ? '✅' : '❌'}`);
    return status === 200;
  } catch (error) {
    console.log(`${url} - Error: ${error.message} ❌`);
    return false;
  }
}

async function testAllRoutes() {
  console.log('Testing DSVI Directory Routes...\n');
  
  for (const route of routes) {
    await testRoute(route);
  }
  
  console.log('\nRoute testing complete!');
}

testAllRoutes();