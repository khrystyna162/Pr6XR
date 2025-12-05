import db from './database.js';
import { Session } from '../domain/Session.js';
import { randomBytes } from 'crypto';

export class SessionRepository {
  create(userId, expiresInHours = 24) {
    const id = randomBytes(32).toString('hex');
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString();
    
    const sessionData = db.createSession(id, userId, expiresAt, createdAt);
    
    return new Session(sessionData);
  }

  findById(id) {
    const row = db.findSessionById(id);
    return row ? new Session(row) : null;
  }

  delete(id) {
    db.deleteSession(id);
  }

  deleteExpired() {
    db.deleteExpiredSessions();
  }
}
