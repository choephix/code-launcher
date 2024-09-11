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

module.exports = buildOptions;
