const { MongoMemoryServer } = require('mongodb-memory-server');
const { execSync, spawn } = require('child_process');
const path = require('path');

async function main() {
  console.log('Starting In-Memory MongoDB Server...');
  // Let MongoMemoryServer auto-download/cache a stable MongoDB binary
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  console.log(`In-Memory MongoDB Server started at: ${uri}`);

  // Set environment variables for Next.js and Mongoose connection
  process.env.MONGODB_URI = uri;
  process.env.NEXTAUTH_SECRET = 'dev-secret-key-for-auth-token-validation';
  process.env.NEXTAUTH_URL = 'http://localhost:3000';

  console.log('\nRunning Seed Scripts...');
  try {
    console.log('1/3 Seeding main roles, site config, and super admin...');
    execSync('node scripts/seed.js', { stdio: 'inherit', env: process.env });

    console.log('\n2/3 Seeding default categories...');
    execSync('node scripts/seed-categories.js', { stdio: 'inherit', env: process.env });

    console.log('\n3/3 Seeding navigation paths...');
    execSync('node scripts/seed-nav-paths.js', { stdio: 'inherit', env: process.env });

    console.log('\nSeeding complete! Database is ready.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    await mongoServer.stop();
    process.exit(1);
  }

  console.log('\nStarting Next.js dev server...');
  const nextDev = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true,
    env: process.env
  });

  const cleanup = async () => {
    console.log('\nStopping In-Memory MongoDB Server...');
    await mongoServer.stop();
    console.log('Cleaned up. Exiting.');
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
  nextDev.on('exit', async (code) => {
    await mongoServer.stop();
    process.exit(code || 0);
  });
}

main().catch(async (err) => {
  console.error('Failed to run in-memory dev script:', err);
  process.exit(1);
});
