import { fileURLToPath } from 'url';
import path from 'path';

import fastifyStatic from '@fastify/static';
import Fastify, { FastifyInstance, FastifyRequest } from 'fastify';

import dotenv from 'dotenv';

import { createCodeLauncherServerActions } from '@code-launcher/shell-operations';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

if (!process.env.CODELAUNCHER_WORKSPACE_PATH) {
  console.error('CODELAUNCHER_WORKSPACE_PATH environment variable is not set.');
  throw process.exit(1);
}

const fastify: FastifyInstance = Fastify({ logger: true });

const PORT = +(process.env.PORT || 19997);

const cmdArgs = parseCommandLineArgs();
const workspacePath = cmdArgs.workspacePath || process.env.CODELAUNCHER_WORKSPACE_PATH;

console.log('//// Workspace Path:', workspacePath);
console.log('//// Port:', PORT);

fastify.register(fastifyStatic, {
  root: [path.resolve(__dirname, './client'), path.resolve(__dirname, './dist/client')],
  prefix: '/',
});

// API routes
fastify.register(
  (fastify, _, done) => {
    const CodeLauncherServerActions = createCodeLauncherServerActions(workspacePath);

    //// Get Project Directories List
    fastify.get('/ls', async (request, reply) => {
      const result = await CodeLauncherServerActions.getProjectDirectoriesList();
      return result;
    });

    //// Run Shell Command
    fastify.post(
      '/run-command',
      async (
        request: FastifyRequest<{
          Body: { command: string };
        }>,
        reply
      ) => {
        const { command } = request.body;
        const result = await CodeLauncherServerActions.runCommand(command);
        return result;
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
