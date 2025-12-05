import fp from 'fastify-plugin';
import { UserRepository } from '../repositories/UserRepository.js';
import { SessionRepository } from '../repositories/SessionRepository.js';

const userRepo = new UserRepository();
const sessionRepo = new SessionRepository();

async function authPlugin(fastify) {
  fastify.decorate('authenticate', async function (request, reply) {
    console.log('[AUTH] Cookies:', request.cookies);
    const sessionId = request.cookies.sessionId;
    console.log('[AUTH] Session ID:', sessionId);
    
    if (!sessionId) {
      console.log('[AUTH] No session ID found');
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    const session = sessionRepo.findById(sessionId);
    console.log('[AUTH] Session found:', session);
    
    if (!session || session.isExpired()) {
      console.log('[AUTH] Session invalid or expired');
      if (session) {
        sessionRepo.delete(sessionId);
      }
      reply.clearCookie('sessionId');
      return reply.code(401).send({ error: 'Session expired or invalid' });
    }

    const user = userRepo.findById(session.userId);
    console.log('[AUTH] User found:', user);
    
    if (!user) {
      console.log('[AUTH] User not found');
      return reply.code(401).send({ error: 'User not found' });
    }

    request.user = user;
    console.log('[AUTH] User set on request:', request.user);
  });
}

export default fp(authPlugin);
