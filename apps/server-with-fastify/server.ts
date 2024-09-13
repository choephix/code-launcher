const fastifyStatic = require('@fastify/static') as typeof import('@fastify/static');
const Fastify = require('fastify') as typeof import('fastify');
const path = require('path') as typeof import('path');
const fs = require('fs') as typeof import('fs');


log('//// prod/dev:', process.env.NODE_ENV);
log('//// __dirname:', __dirname);

const cmdArgs = parseCommandLineArgs();
const verbose = cmdArgs.verbose || false;

if (cmdArgs.help) {
  displayHelp();
  process.exit(0);
}

function log(...args: any[]) {
  if (verbose) {
    console.log(...args);
  }
}

const workspacePath = cmdArgs.workspacePath || process.env.CODELAUNCHER_WORKSPACE_PATH || '/workspaces';
const port = +(cmdArgs.port || process.env.CODELAUNCHER_PORT || 19001);

if (!workspacePath) {
  console.error(
    'Workspace path not given. Please provide a --workspace argument or set the CODELAUNCHER_WORKSPACE_PATH environment variable.'
  );
  throw process.exit(1);
}

log('//// Workspace Path:', workspacePath);
log('//// Port:', port);

const fastify = Fastify({ logger: verbose }) as import('fastify').FastifyInstance;

const pathsToServeMaybe = [path.join(__dirname, 'client')];
const pathsToServe = pathsToServeMaybe.filter(p => fs.existsSync(p));
log('//// Paths to serve statically?', pathsToServeMaybe);
if (pathsToServe.length > 0) {
  fastify.register(fastifyStatic, { root: pathsToServe, prefix: '/' });
}

fastify.register(require('@fastify/websocket'));

// API routes
fastify.register(
  (fastify, _, done) => {
    //// Get Project Directories List
    fastify.get('/ls', async () => {
      const { createCodeLauncherServerActions } = await import('@code-launcher/shell-operations');
      const CodeLauncherServerActions = createCodeLauncherServerActions(workspacePath);

      return await CodeLauncherServerActions.getProjectDirectoriesList();
    });

    //// Run Shell Command
    fastify.post(
      '/run-command',
      async (
        request: import('fastify').FastifyRequest<{
          Body: { command: string };
        }>,
        reply
      ) => {
        const { createCodeLauncherServerActions } = await import('@code-launcher/shell-operations');
        const CodeLauncherServerActions = createCodeLauncherServerActions(workspacePath);

        const { command } = request.body;
        return await CodeLauncherServerActions.runCommand(command);
      }
    );

    //// Run Shell Command (WebSocket)
    // @ts-ignore
    fastify.get('/run-command-stream', { websocket: true }, (connection, req) => {
      connection.socket.on('message', async (message: string) => {
        const { command } = JSON.parse(message);
        const { runCommandStream } = await import('@code-launcher/shell-operations');

        const stream = runCommandStream(command);

        let commandOutput = '';

        for await (const progress of stream) {
          if (progress.type === 'stdout') {
            log('[STDOUT]:', progress.data);
          } else {
            console.error('[STDERR]:', progress.data);
          }

          commandOutput += progress.data;
        }

        const result = await stream;

        return {
          commandOutput,
          result: result.output,
          exitCode: result.exitCode,
        };
      });
    });

    done();
  },
  { prefix: '/api' }
);

const start = async () => {
  try {
    const host = cmdArgs.expose ? '0.0.0.0' : 'localhost';
    await fastify.listen({ port, host });
    console.log(`🚀 Fastify server is running on ${fastify.server.address()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

//// //// //// ////

interface CommandLineArgs {
  workspacePath?: string;
  port?: number;
  expose?: boolean;
  help?: boolean;
  verbose?: boolean;
}

function parseCommandLineArgs(): CommandLineArgs {
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

function displayHelp() {
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
