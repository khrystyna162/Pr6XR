import { UserRepository } from '../repositories/UserRepository.js';
import { SessionRepository } from '../repositories/SessionRepository.js';
import { registerSchema, loginSchema, userInfoSchema, logoutSchema } from '../schemas/authSchemas.js';

const userRepo = new UserRepository();
const sessionRepo = new SessionRepository();

export async function authRoutes(fastify) {
  // POST /auth/register
  fastify.post('/auth/register', { schema: registerSchema }, async (request, reply) => {
    const { username, password } = request.body;

    const existingUser = userRepo.findByUsername(username);
    if (existingUser) {
      return reply.code(400).send({ error: 'Username already exists' });
    }

    const user = await userRepo.create(username, password);

    return reply.code(201).send({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    });
  });

  // POST /auth/login
  fastify.post('/auth/login', { schema: loginSchema }, async (request, reply) => {
    const { username, password } = request.body;

    const user = userRepo.findByUsername(username);
    if (!user) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const isValidPassword = await userRepo.verifyPassword(user, password);
    if (!isValidPassword) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const session = sessionRepo.create(user.id);

    reply.setCookie('sessionId', session.id, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60
    });

    return reply.send({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username
      }
    });
  });

  // GET /auth/info
  fastify.get('/auth/info', {
    schema: userInfoSchema,
    preHandler: fastify.authenticate
  }, async (request, reply) => {
    console.log('[HANDLER] request.user:', request.user);
    return reply.send({
      id: request.user.id,
      username: request.user.username,
      createdAt: request.user.createdAt
    });
  });

  // POST /auth/logout
  fastify.post('/auth/logout', {
    schema: logoutSchema,
    preHandler: fastify.authenticate
  }, async (request, reply) => {
    const sessionId = request.cookies.sessionId;
    
    if (sessionId) {
      sessionRepo.delete(sessionId);
    }

    reply.clearCookie('sessionId');

    return reply.send({ message: 'Logout successful' });
  });
}
