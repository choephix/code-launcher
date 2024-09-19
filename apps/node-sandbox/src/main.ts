export async function runAndLogCommand(command: string) {
  const ops = await import('@code-launcher/shell-operations');
  const stream = ops.runCommandStream(command);

  for await (const progress of stream) {
    if (progress.type === 'stdout') {
      console.log('🟢 [STDOUT]:', progress.data);
    } else {
      console.error('🔴 [STDERR]:', progress.data);
    }
  }

  console.log('✅ Command completed');
}

async function main() {
  await runAndLogCommand(`sh -c 'for i in $(seq 1 5); do echo "STDOUT Line $i"; echo "STDERR Line $i" >&2; sleep .1; done'`);
}

main().catch(error => console.error('❌ Error:', error));
