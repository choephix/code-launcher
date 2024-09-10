import Fastify, { FastifyInstance, FastifyRequest } from 'fastify';
import { CodeLauncherServerActions } from '@code-launcher/shell-operations';

const fastify: FastifyInstance = Fastify({
  logger: true,
});

fastify.get('/', async (request, reply) => {
  return 'Hello Fastify';
});

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

