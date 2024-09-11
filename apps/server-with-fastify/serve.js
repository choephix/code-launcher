const esbuild = require('esbuild');
const chokidar = require('chokidar');
const { spawn } = require('child_process');

let serverProcess = null;

const buildOptions = {
  entryPoints: ['index.ts'],
  bundle: true,
  platform: 'node',
  target: ['node18'],
  outfile: '../../dist/server.js',
  format: 'cjs',
  banner: {
    js: '#!/usr/bin/env node',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.CODELAUNCHER_WORKSPACE_PATH': JSON.stringify(process.env.CODELAUNCHER_WORKSPACE_PATH || '/workspaces'),
  },
  logLevel: 'info',
  external: ['node:*'],
};

async function build() {
  console.log('Starting esbuild...');
  try {
    await esbuild.build(buildOptions);
    console.log('Build completed successfully');
    return true;
  } catch (error) {
    console.error('Build failed:', error);
    return false;
  }
}

function startServer(args = []) {
  if (serverProcess) {
    serverProcess.kill();
  }

  serverProcess = spawn('node', ['../../dist/server.js', ...args], { stdio: 'inherit' });
  console.log('Server started');

  serverProcess.on('close', code => {
    console.log(`Server process exited with code ${code}`);
  });
}

async function rebuildAndRestart(args = []) {
  const success = await build();
  if (success) {
    startServer(args);
  }
}

// Initial build and start
rebuildAndRestart(process.argv.slice(2));

// Watch for changes
chokidar.watch(['**/*.ts', '**/*.js'], { ignored: /node_modules|dist/ }).on('change', path => {
  console.log(`File ${path} has been changed`);
  rebuildAndRestart(process.argv.slice(2));
});

// Handle script interruption
process.on('SIGINT', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  process.exit();
});
