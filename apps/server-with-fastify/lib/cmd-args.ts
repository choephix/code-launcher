export interface CommandLineArgs {
  workspacePath?: string;
  port?: number;
  expose?: boolean;
  help?: boolean;
  verbose?: boolean;
}

export function parseCommandLineArgs(): CommandLineArgs {
  const args = process.argv.slice(2);
  const result: CommandLineArgs = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-w' || args[i] === '--workspace') {
      result.workspacePath = args[i + 1];
      i++;
    } else if (args[i] === '-p' || args[i] === '--port') {
      result.port = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '-x' || args[i] === '--expose') {
      result.expose = true;
    } else if (args[i] === '-h' || args[i] === '--help') {
      result.help = true;
    } else if (args[i] === '-v' || args[i] === '--verbose') {
      result.verbose = true;
    }
  }

  return result;
}

export function displayCommandLineHelp() {
  console.log(`
Usage: node server.js [options]

Options:
  -w, --workspace <path>  Set the workspace path
  -p, --port <number>     Set the port number (default: 19001)
  -x, --expose            Make the server externally accessible
  -v, --verbose           Enable verbose logging
  -h, --help              Display this help message

Environment variables:
  CODELAUNCHER_WORKSPACE_PATH  Set the workspace path
  CODELAUNCHER_PORT            Set the port number
`);
}
