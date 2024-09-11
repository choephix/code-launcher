import * as esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['index.ts'],
    bundle: true,
    platform: 'node',
    target: ['node18'],
    outfile: '../../build/server/index.js',
    banner: {
      js: '#!/usr/bin/env node',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.CODELAUNCHER_WORKSPACE_PATH': JSON.stringify(
        process.env.CODELAUNCHER_WORKSPACE_PATH || '/workspaces'
      ),
    },
  })
  .catch(() => process.exit(1));
