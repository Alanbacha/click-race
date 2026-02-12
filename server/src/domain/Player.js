/**
 * Entidade Player - Single Responsibility
 */
export class Player {
  constructor({ id, name, socketId }) {
    this.id = id;
    this.name = name;
    this.socketId = socketId;
    this.teamId = null;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      teamId: this.teamId,
    };
  }
}
