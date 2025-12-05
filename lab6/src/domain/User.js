export class User {
  constructor({ id, username, passwordHash, createdAt }) {
    this.id = id;
    this.username = username;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt || new Date().toISOString();
  }
}
