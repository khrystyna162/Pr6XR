class InMemoryDatabase {
  constructor() {
    this.users = [];
    this.sessions = [];
    this.userIdCounter = 1;
  }

  createUser(username, passwordHash, createdAt) {
    const user = {
      id: this.userIdCounter++,
      username,
      passwordHash,
      createdAt
    };
    this.users.push(user);
    return user;
  }

  findUserByUsername(username) {
    return this.users.find(u => u.username === username);
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createSession(id, userId, expiresAt, createdAt) {
    const session = { id, userId, expiresAt, createdAt };
    this.sessions.push(session);
    return session;
  }

  findSessionById(id) {
    return this.sessions.find(s => s.id === id);
  }

  deleteSession(id) {
    const index = this.sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      this.sessions.splice(index, 1);
    }
  }

  deleteExpiredSessions() {
    const now = new Date().toISOString();
    this.sessions = this.sessions.filter(s => s.expiresAt >= now);
  }
}

const db = new InMemoryDatabase();
export default db;
