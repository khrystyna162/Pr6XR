export async function resourceRoutes(fastify) {
  fastify.get('/resources', async (request, reply) => {
    return { 
      message: 'Public resource list',
      resources: ['item1', 'item2', 'item3']
    };
  });

  fastify.post('/resources', {
    preHandler: fastify.authenticate
  }, async (request, reply) => {
    return { 
      message: 'Resource created by user',
      userId: request.user.id,
      username: request.user.username
    };
  });

  fastify.put('/resources/:id', {
    preHandler: fastify.authenticate
  }, async (request, reply) => {
    return { 
      message: `Resource ${request.params.id} updated by user`,
      userId: request.user.id,
      username: request.user.username
    };
  });

  fastify.delete('/resources/:id', {
    preHandler: fastify.authenticate
  }, async (request, reply) => {
    return { 
      message: `Resource ${request.params.id} deleted by user`,
      userId: request.user.id,
      username: request.user.username
    };
  });
}
