/**
 * Entidade Team - Single Responsibility
 */
export const TEAM_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
];

export class Team {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color || TEAM_COLORS[id % TEAM_COLORS.length];
    this.score = 0;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      score: this.score,
    };
  }
}
