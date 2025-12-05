export class Session {
  constructor({ id, userId, expiresAt, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt || new Date().toISOString();
  }

  isExpired() {
    return new Date(this.expiresAt) < new Date();
  }
}
