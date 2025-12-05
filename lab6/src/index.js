import Fastify from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import fastifyCookie from '@fastify/cookie';
import { authRoutes } from './routes/auth.js';
import { resourceRoutes } from './routes/resources.js';
import authPlugin from './plugins/auth.js';

const fastify = Fastify({
  logger: true
});

await fastify.register(fastifyCookie);

await fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Lab 6 - Authentication API',
      description: 'API для автентифікації та авторизації',
      version: '1.0.0'
    },
    securityDefinitions: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'sessionId'
      }
    }
  }
});

await fastify.register(fastifySwaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false
  }
});

await fastify.register(authPlugin);

await fastify.register(authRoutes);
await fastify.register(resourceRoutes);

fastify.get('/', async (request, reply) => {
  return { message: 'Lab 6 - Authentication API' };
});

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' });
  console.log('Server is running on http://localhost:3000');
  console.log('Swagger docs available at http://localhost:3000/docs');
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
