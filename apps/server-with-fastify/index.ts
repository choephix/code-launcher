const fastifyStatic = require('@fastify/static');
const Fastify = require('fastify');
const path = require('path');
const fs = require('fs');

console.log('//// prod/dev:', process.env.NODE_ENV);
console.log('//// __dirname:', __dirname);

const fastify = Fastify({ logger: true }) as import('fastify').FastifyInstance;

const PORT = +(process.env.PORT || 19999);

const cmdArgs = parseCommandLineArgs();
const workspacePath = cmdArgs.workspacePath || process.env.CODELAUNCHER_WORKSPACE_PATH || '/workspaces';

if (!workspacePath) {
  console.error(
    'Workspace path not given. Please provide a --workspace argument or set the CODELAUNCHER_WORKSPACE_PATH environment variable.'
  );
  throw process.exit(1);
}

console.log('//// Workspace Path:', workspacePath);
console.log('//// Port:', PORT);

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
      async (request: import('fastify').FastifyRequest<{ Body: { command: string } }>, reply) => {
        const { createCodeLauncherServerActions } = await import('@code-launcher/shell-operations');
        const CodeLauncherServerActions = createCodeLauncherServerActions(workspacePath);

        const { command } = request.body;
        return await CodeLauncherServerActions.runCommand(command);
      }
    );

    done();
  },
  { prefix: '/api' }
);

const start = async () => {
  try {
    await fastify.listen({ port: PORT });
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
