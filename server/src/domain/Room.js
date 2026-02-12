import { v4 as uuidv4 } from 'uuid';
import { Player } from './Player.js';
import { Team, TEAM_COLORS } from './Team.js';

/**
 * Entidade Room - Single Responsibility
 */
export class Room {
  constructor({ isPrivate = false, password = null }) {
    this.id = uuidv4().replace(/-/g, '').slice(0, 6).toUpperCase();
    this.code = this.id;
    this.isPrivate = isPrivate;
    this.password = password;
    this.adminId = null;
    this.players = new Map();
    this.teams = [];
    this.gameState = 'lobby'; // lobby | team_selection | game | round_end
    this.roundState = 'waiting'; // waiting | countdown | active | ended
    this.roundCountdown = 3; // segundos antes de liberar botão
    this.roundDuration = 30; // segundos do timer
    this.targetScore = 100;
    this.currentRound = 0;
    this.roundWinner = null;
    this.roundPoints = 0;
  }

  addPlayer(player) {
    this.players.set(player.id, player);
    if (!this.adminId) this.adminId = player.id;
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
    if (this.adminId === playerId && this.players.size > 0) {
      this.adminId = this.players.keys().next().value;
    }
  }

  getPlayer(playerId) {
    return this.players.get(playerId);
  }

  createTeams(count) {
    this.teams = Array.from({ length: count }, (_, i) => 
      new Team(i, `Time ${i + 1}`, TEAM_COLORS[i % TEAM_COLORS.length])
    );
  }

  getPlayersByTeam() {
    const grouped = {};
    this.teams.forEach(t => grouped[t.id] = []);
    grouped.unassigned = [];
    this.players.forEach(p => {
      if (p.teamId != null && this.teams[p.teamId]) {
        grouped[p.teamId].push(p.toJSON());
      } else {
        grouped.unassigned.push(p.toJSON());
      }
    });
    return grouped;
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      isPrivate: this.isPrivate,
      adminId: this.adminId,
      gameState: this.gameState,
      roundState: this.roundState,
      roundCountdown: this.roundCountdown,
      roundDuration: this.roundDuration,
      targetScore: this.targetScore,
      currentRound: this.currentRound,
      roundWinner: this.roundWinner,
      roundPoints: this.roundPoints,
      teams: this.teams.map(t => t.toJSON()),
      players: Array.from(this.players.values()).map(p => p.toJSON()),
      playersByTeam: this.getPlayersByTeam(),
    };
  }
}
