const fastifyStatic = require('@fastify/static') as typeof import('@fastify/static');
const Fastify = require('fastify') as typeof import('fastify');
const path = require('path') as typeof import('path');
const fs = require('fs') as typeof import('fs');

const { parseCommandLineArgs, displayCommandLineHelp } = require('./lib/cmd-args') as typeof import('./lib/cmd-args');

log('//// prod/dev:', process.env.NODE_ENV);
log('//// __dirname:', __dirname);

const cmdArgs = parseCommandLineArgs();
const verbose = cmdArgs.verbose || false;
const expose = cmdArgs.expose || false;

if (cmdArgs.help) {
  displayCommandLineHelp();
  process.exit(0);
}

function log(...args: any[]) {
  if (verbose) {
    console.log(...args);
  }
}

const workspacePathRaw = cmdArgs.workspacePath || process.env.CODELAUNCHER_WORKSPACE_PATH || '..';
const port = +(cmdArgs.port || process.env.CODELAUNCHER_PORT || 19001);

if (!workspacePathRaw) {
  console.error(
    'Workspace path not given. Please provide a --workspace argument or set the CODELAUNCHER_WORKSPACE_PATH environment variable.'
  );
  throw process.exit(1);
}

log('//// Port:', port);
log('//// Workspace Path:', workspacePathRaw);

const workspacePath = path.resolve(workspacePathRaw);
log('//// Workspace Path (resolved):', workspacePath);

const fastify = Fastify({
  logger: verbose,
}) as import('fastify').FastifyInstance;

const pathsToServeMaybe = [path.join(__dirname, 'client')];
const pathsToServe = pathsToServeMaybe.filter(p => fs.existsSync(p));
log('//// Paths to serve statically?', pathsToServeMaybe);
if (pathsToServe.length > 0) {
  fastify.register(fastifyStatic, { root: pathsToServe, prefix: '/' });
}

// fastify.register(require('@fastify/websocket'));

// API routes
fastify.register(
  async (fastify) => {
    const {
      createCodeLauncherServerActions,
      createCodeLauncherServerExtraActions,
    } = //
      await import('@code-launcher/shell-operations');
      
    const CodeLauncherServerActions = createCodeLauncherServerActions(workspacePath);
    const extraActions = createCodeLauncherServerExtraActions(workspacePath);

    //// Get Project Directories List
    fastify.get('/ls', async (request: import('fastify').FastifyRequest<{ Querystring: { ignoreCache?: string } }>) => {
      const ignoreCache = request.query.ignoreCache === 'true';
      console.log(`🔧 Fetching project directories${ignoreCache ? ' (ignoring cache)' : ''}`);
      return await CodeLauncherServerActions.getProjectDirectoriesList(ignoreCache);
    });

    //// Run Shell Command
    fastify.post('/run-command', async (request: import('fastify').FastifyRequest<{ Body: { command: string } }>) => {
      const { command } = request.body;
      return await CodeLauncherServerActions.runCommand(command);
    });

    //// Find Open Ports
    fastify.get('/find-open-ports', async () => {
      return await extraActions.findOpenPorts();
    });
  },
  { prefix: '/api' }
);

const start = async () => {
  try {
    const host = expose ? '0.0.0.0' : 'localhost';
    await fastify.listen({ port, host });
    console.log(`🚀 Fastify server is running on ${host}:${port}`);
    if (expose) {
      console.log('⚠️ Server is exposed to the local network. Be cautious.');
    }
  } catch (err) {
    console.error(err);
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
