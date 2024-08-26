const fastify = require('fastify')({ logger: true });
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

fastify.register(require('@fastify/formbody'));
fastify.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs'),
  },
});

fastify.get('/', (req, reply) => {
  reply.view('/templates/index.ejs', { result: null });
});

fastify.post('/run-command', async (req, reply) => {
  const { command } = req.body;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      const commandOutput = stdout || stderr || 'Command executed successfully.';

      const cpuUsage = os.loadavg()[0].toFixed(2);
      const memUsage = (1 - os.freemem() / os.totalmem()).toFixed(2);

      const result = {
        commandOutput,
        command,
        cpuUsage,
        memUsage,
      };

      resolve(result);
    });
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: 1500 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
