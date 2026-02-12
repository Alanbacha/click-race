import fs from 'fs';
import { GameService } from '../services/GameService.js';

const DEBUG_LOG = '/Users/alanbacha/Dev/.cursor/debug.log';
function debugLog(obj) {
  try {
    fs.appendFileSync(DEBUG_LOG, JSON.stringify({ ...obj, timestamp: Date.now() }) + '\n');
  } catch (_) {}
}

/**
 * SocketHandler - Dependency Inversion
 * Orquestra eventos Socket.io delegando para os serviços
 */
export class SocketHandler {
  constructor(io, roomService) {
    this.io = io;
    this.roomService = roomService;
  }

  broadcastToRoom(roomCode, event, data) {
    this.io.to(roomCode).emit(event, data);
  }

  setupHandlers() {
    this.io.on('connection', (socket) => {
      // #region agent log
      debugLog({ location: 'SocketHandler.js:connection', message: 'client connected', data: { socketId: socket.id }, hypothesisId: 'H1' });
      fetch('http://127.0.0.1:7242/ingest/52dfa0eb-968d-4933-8c3b-938ecdff2203',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SocketHandler.js:connection','message':'client connected',data:{socketId:socket.id},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      socket.on('create_room', (data, callback) => {
        // #region agent log
        debugLog({ location: 'SocketHandler.js:create_room', message: 'create_room received', data: { playerName: data?.playerName }, hypothesisId: 'H2' });
        fetch('http://127.0.0.1:7242/ingest/52dfa0eb-968d-4933-8c3b-938ecdff2203',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'SocketHandler.js:create_room','message':'create_room received',data:{playerName:data?.playerName},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        const room = this.roomService.createRoom({
          isPrivate: data.isPrivate,
          password: data.password,
        });
        const result = this.roomService.joinRoom(
          socket.id,
          room.code,
          data.playerName
        );
        socket.join(room.code);
        callback({ success: true, room: room.toJSON(), player: result.player.toJSON(), isAdmin: true });
      });

      socket.on('join_room', (data, callback) => {
        const result = this.roomService.joinRoom(
          socket.id,
          data.roomCode,
          data.playerName,
          data.password
        );
        if (!result.success) {
          return callback({ success: false, error: result.error });
        }
        socket.join(result.room.code);
        callback({
          success: true,
          room: result.room.toJSON(),
          player: result.player.toJSON(),
          isAdmin: result.room.adminId === result.player.id,
        });
        this.broadcastToRoom(result.room.code, 'room_update', result.room.toJSON());
      });

      socket.on('disconnect', () => {
        const result = this.roomService.leaveRoom(socket.id);
        if (result?.room) {
          this.broadcastToRoom(result.roomCode, 'room_update', result.room.toJSON());
        }
      });

      socket.on('create_teams', (data) => {
        if (!this.roomService.isAdmin(socket.id)) return;
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room || room.gameState !== 'lobby') return;
        
        room.gameState = 'team_selection';
        GameService.assignTeams(room, { count: data.count });
        this.broadcastToRoom(room.code, 'room_update', room.toJSON());
      });

      socket.on('move_player', (data) => {
        if (!this.roomService.isAdmin(socket.id)) return;
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room) return;
        
        GameService.updatePlayerTeam(room, data.playerId, data.teamId);
        this.broadcastToRoom(room.code, 'room_update', room.toJSON());
      });

      socket.on('shuffle_teams', () => {
        if (!this.roomService.isAdmin(socket.id)) return;
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room) return;
        
        GameService.shuffleTeams(room);
        this.broadcastToRoom(room.code, 'room_update', room.toJSON());
      });

      socket.on('start_game', (data) => {
        if (!this.roomService.isAdmin(socket.id)) return;
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room || room.gameState !== 'team_selection') return;
        
        GameService.startGame(room, {
          targetScore: data.targetScore,
          roundDuration: data.roundDuration,
          roundCountdown: data.roundCountdown,
        });
        this.broadcastToRoom(room.code, 'room_update', room.toJSON());
      });

      socket.on('start_round', () => {
        if (!this.roomService.isAdmin(socket.id)) return;
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room) return;
        
        GameService.startRound(room);
        this.broadcastToRoom(room.code, 'room_update', room.toJSON());

        const countdown = room.roundCountdown || 3;
        const roomCode = room.code;
        if (countdown > 0) {
          setTimeout(() => {
            const r = this.roomService.getRoom(roomCode);
            if (r && r.roundState === 'countdown') {
              GameService.activateRound(r);
              this.broadcastToRoom(roomCode, 'room_update', r.toJSON());
            }
          }, countdown * 1000);
        } else {
          GameService.activateRound(room);
          this.broadcastToRoom(room.code, 'room_update', room.toJSON());
        }
      });

      socket.on('activate_round', () => {
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room || room.roundState !== 'countdown') return;
        
        GameService.activateRound(room);
        this.broadcastToRoom(room.code, 'room_update', room.toJSON());
      });

      socket.on('player_click', () => {
        const room = this.roomService.getRoomBySocket(socket.id);
        const player = this.roomService.getPlayerBySocket(socket.id);
        if (!room || !player) return;
        
        if (GameService.playerClicked(room, player.id)) {
          this.broadcastToRoom(room.code, 'room_update', room.toJSON());
        }
      });

      socket.on('round_timeout', () => {
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room) return;
        
        if (GameService.roundTimeout(room)) {
          this.broadcastToRoom(room.code, 'room_update', room.toJSON());
        }
      });

      socket.on('end_round', (data) => {
        if (!this.roomService.isAdmin(socket.id)) return;
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room) return;
        
        GameService.endRound(room, data.points);
        this.broadcastToRoom(room.code, 'room_update', room.toJSON());
      });

      socket.on('next_round', () => {
        if (!this.roomService.isAdmin(socket.id)) return;
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room) return;
        
        GameService.nextRound(room);
        this.broadcastToRoom(room.code, 'room_update', room.toJSON());
      });

      socket.on('update_config', (data) => {
        if (!this.roomService.isAdmin(socket.id)) return;
        const room = this.roomService.getRoomBySocket(socket.id);
        if (!room || room.gameState === 'game' && room.roundState === 'active') return;
        
        GameService.updateConfig(room, data);
        this.broadcastToRoom(room.code, 'room_update', room.toJSON());
      });
    });
  }
}
