import { CodeLauncherServerActions } from '@code-launcher/shell-operations';
import fastifyStatic from '@fastify/static';
import Fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import path from 'path';

const fastify: FastifyInstance = Fastify({
  logger: true,
});

// Serve static files from ../../build-client at the root path
fastify.register(fastifyStatic, {
  root: path.resolve('../../build-client'),
  prefix: '/', // Serve at root path
});

// API routes
fastify.register(
  (fastify, _, done) => {
    fastify.get('/ls', async (request, reply) => {
      const result = await CodeLauncherServerActions.getProjectDirectoriesList();
      return result;
    });

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
    await fastify.listen({ port: 3000 });
    console.log(`🚀 Fastify server is running on ${fastify.server.address()}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
