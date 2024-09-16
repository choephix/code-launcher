const esbuild = require('esbuild');
const buildOptions = require('./build-options');

console.log('Starting esbuild...');

esbuild
  .build(buildOptions)
  .then(() => {
    console.log('Build completed successfully');
  })
  .catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
  });
