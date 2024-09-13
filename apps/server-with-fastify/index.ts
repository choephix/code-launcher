const fastifyStatic = require('@fastify/static');
const Fastify = require('fastify');
const path = require('path');
const fs = require('fs');

console.log('//// prod/dev:', process.env.NODE_ENV);
console.log('//// __dirname:', __dirname);

const fastify = Fastify({ logger: true }) as import('fastify').FastifyInstance;

const cmdArgs = parseCommandLineArgs();
const workspacePath = cmdArgs.workspacePath || process.env.CODELAUNCHER_WORKSPACE_PATH || '/workspaces';

const port = +(cmdArgs.port || process.env.PORT || 19999);

if (!workspacePath) {
  console.error(
    'Workspace path not given. Please provide a --workspace argument or set the CODELAUNCHER_WORKSPACE_PATH environment variable.'
  );
  throw process.exit(1);
}

console.log('//// Workspace Path:', workspacePath);
console.log('//// Port:', port);

const pathsToServeMaybe = [path.join(__dirname, 'client')];
const pathsToServe = pathsToServeMaybe.filter(p => fs.existsSync(p));
console.log('//// Paths to serve statically:', pathsToServeMaybe, pathsToServe);
// if (process.env.NODE_ENV === 'production') {
if (pathsToServe.length > 0) {
  fastify.register(fastifyStatic, {
    root: pathsToServe,
    prefix: '/',
  });
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
            console.log('[STDOUT]:', progress.data);
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
    await fastify.listen({ port });
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
    }
  }

  return result;
}
