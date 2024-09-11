import path from 'path';

import fastifyStatic from '@fastify/static';
import Fastify, { FastifyInstance, FastifyRequest } from 'fastify';

import dotenv from 'dotenv';

import { createCodeLauncherServerActions } from '@code-launcher/shell-operations';

dotenv.config();

if (!process.env.CODELAUNCHER_WORKSPACE_PATH) {
  console.error('CODELAUNCHER_WORKSPACE_PATH environment variable is not set.');
  throw process.exit(1);
}

const fastify: FastifyInstance = Fastify({ logger: true });

const PORT = +(process.env.PORT || 19999);
console.log('//// process.env.CODELAUNCHER_WORKSPACE_PATH', process.env.CODELAUNCHER_WORKSPACE_PATH);

fastify.register(fastifyStatic, {
  root: path.resolve('./client'),
  prefix: '/',
});

// API routes
fastify.register(
  (fastify, _, done) => {
    const CodeLauncherServerActions = createCodeLauncherServerActions(process.env.CODELAUNCHER_WORKSPACE_PATH!);

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
