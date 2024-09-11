const esbuild = require('esbuild');
const buildOptions = require('./build-options');

console.log('Starting esbuild...');

esbuild
  .build({
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
      'process.env.CODELAUNCHER_WORKSPACE_PATH': JSON.stringify(
        process.env.CODELAUNCHER_WORKSPACE_PATH || '/workspaces'
      ),
    },
    logLevel: 'info',
    external: ['node:*'],
  })
  .then(() => {
    console.log('Build completed successfully');
  })
  .catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
  });
