/**
 * GameService - Single Responsibility
 * Gerencia lógica do jogo: times, rodadas, pontuação
 */
export class GameService {
  static assignTeams(room, teamsConfig) {
    room.createTeams(teamsConfig.count);
    return room;
  }

  static updatePlayerTeam(room, playerId, teamId) {
    const player = room.getPlayer(playerId);
    if (player) player.teamId = teamId;
    return room;
  }

  static shuffleTeams(room) {
    const unassigned = [...room.players.values()].filter(p => p.teamId === null);
    const count = room.teams.length;
    unassigned.forEach((player, i) => {
      player.teamId = i % count;
    });
    return room;
  }

  static startGame(room, { targetScore, roundDuration, roundCountdown }) {
    room.gameState = 'game';
    room.targetScore = targetScore ?? room.targetScore;
    room.roundDuration = roundDuration ?? room.roundDuration;
    room.roundCountdown = roundCountdown ?? room.roundCountdown;
    room.currentRound = 1;
    room.roundState = 'waiting';
    return room;
  }

  static startRound(room) {
    room.roundState = 'countdown';
    room.roundWinner = null;
    return room;
  }

  static activateRound(room) {
    room.roundState = 'active';
    return room;
  }

  static playerClicked(room, playerId) {
    if (room.roundState !== 'active' || room.roundWinner) return false;
    room.roundWinner = playerId;
    room.roundState = 'ended';
    return true;
  }

  static roundTimeout(room) {
    if (room.roundState !== 'active' || room.roundWinner) return false;
    room.roundState = 'ended';
    return true;
  }

  static endRound(room, points) {
    if (room.roundWinner && room.teams.length > 0) {
      const player = room.getPlayer(room.roundWinner);
      if (player?.teamId !== undefined) {
        room.teams[player.teamId].score += points;
      }
    }
    room.roundPoints = points;
    room.gameState = 'round_end';
    return room;
  }

  static nextRound(room) {
    const maxScore = Math.max(...room.teams.map(t => t.score), 0);
    if (maxScore >= room.targetScore) {
      room.gameState = 'game_over';
      return room;
    }
    room.gameState = 'game';
    room.currentRound++;
    room.roundState = 'waiting';
    room.roundWinner = null;
    return room;
  }

  static updateConfig(room, config) {
    if (config.roundDuration !== undefined) room.roundDuration = config.roundDuration;
    if (config.roundCountdown !== undefined) room.roundCountdown = config.roundCountdown;
    if (config.targetScore !== undefined) room.targetScore = config.targetScore;
    return room;
  }
}
