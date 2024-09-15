const esbuild = require('esbuild');
const chokidar = require('chokidar');
const { spawn } = require('child_process');
const buildOptions = require('./build-options');

let serverProcess = null;

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

  serverProcess = spawn('node', ['../../dist/server.js', ...args], {
    stdio: 'inherit',
  });
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


const watchPaths = [
  path.join(__dirname, '..', '..', '..', 'packages', '**', '*.{ts,js}'),
  path.join(__dirname, '..', '**', '*.{ts,js}'),
];

// Watch for changes
chokidar.watch(watchPaths, { ignored: /node_modules|dist|build/ }).on('change', path => {
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
