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

fastify.post('/run', (req, reply) => {
  exec('ls -la ~', (error, stdout, stderr) => {
    const lsOutput = stdout;

    const cpuUsage = os.loadavg()[0].toFixed(2);
    const memUsage = (1 - os.freemem() / os.totalmem()).toFixed(2);

    const result = {
      lsOutput,
      cpuUsage,
      memUsage,
    };

    reply.view('/templates/index.ejs', { result });
  });
});

fastify.post('/run-custom', (req, reply) => {
  const command = req.body.command;
  exec(command, (error, stdout, stderr) => {
    const commandOutput = stdout || stderr;

    const cpuUsage = os.loadavg()[0].toFixed(2);
    const memUsage = (1 - os.freemem() / os.totalmem()).toFixed(2);

    const result = {
      commandOutput,
      command,
      cpuUsage,
      memUsage,
    };

    reply.view('/templates/index.ejs', { result });
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
