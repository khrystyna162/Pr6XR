import db from './database.js';
import { User } from '../domain/User.js';
import bcrypt from 'bcrypt';

export class UserRepository {
  async create(username, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    
    const userData = db.createUser(username, passwordHash, createdAt);
    
    return new User(userData);
  }

  findByUsername(username) {
    const row = db.findUserByUsername(username);
    return row ? new User(row) : null;
  }

  findById(id) {
    const row = db.findUserById(id);
    return row ? new User(row) : null;
  }

  async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.passwordHash);
  }
}
