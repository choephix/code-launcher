// import { helloWorld } from '@code-launcher/shell-operations';

async function main() {
  const { helloWorld } = await import('@code-launcher/shell-operations');
  const projectDirs = await helloWorld('/home/cx/workspace');
  console.log('🌍 Project directories:', projectDirs);
}

main().catch(error => console.error('❌ Error:', error));
