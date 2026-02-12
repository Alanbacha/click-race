import { v4 as uuidv4 } from 'uuid';
import { Room } from '../domain/Room.js';
import { Player } from '../domain/Player.js';

/**
 * RoomService - Interface Segregation & Single Responsibility
 * Gerencia criação, busca e operações de salas
 */
export class RoomService {
  constructor() {
    this.rooms = new Map();
    this.socketToRoom = new Map();
    this.socketToPlayer = new Map();
  }

  createRoom({ isPrivate, password }) {
    const room = new Room({ isPrivate, password: isPrivate ? password : null });
    this.rooms.set(room.code, room);
    return room;
  }

  getRoom(code) {
    return this.rooms.get(code?.toUpperCase());
  }

  validatePassword(room, password) {
    return !room.isPrivate || room.password === password;
  }

  joinRoom(socketId, roomCode, playerName, password = null) {
    const room = this.getRoom(roomCode);
    if (!room) return { success: false, error: 'Sala não encontrada' };
    if (room.gameState !== 'lobby' && room.gameState !== 'team_selection') {
      return { success: false, error: 'Partida já iniciada' };
    }
    if (!this.validatePassword(room, password)) {
      return { success: false, error: 'Senha incorreta' };
    }

    const player = new Player({ id: uuidv4(), name: playerName, socketId });
    room.addPlayer(player);
    this.socketToRoom.set(socketId, room.code);
    this.socketToPlayer.set(socketId, player.id);

    return { success: true, room, player };
  }

  leaveRoom(socketId) {
    const roomCode = this.socketToRoom.get(socketId);
    const playerId = this.socketToPlayer.get(socketId);
    
    if (!roomCode) return null;
    
    const room = this.rooms.get(roomCode);
    if (room) {
      room.removePlayer(playerId);
      if (room.players.size === 0) this.rooms.delete(roomCode);
    }
    
    this.socketToRoom.delete(socketId);
    this.socketToPlayer.delete(socketId);
    
    return { roomCode, room };
  }

  getRoomBySocket(socketId) {
    const code = this.socketToRoom.get(socketId);
    return code ? this.rooms.get(code) : null;
  }

  getPlayerBySocket(socketId) {
    const room = this.getRoomBySocket(socketId);
    const playerId = this.socketToPlayer.get(socketId);
    return room?.getPlayer(playerId) || null;
  }

  isAdmin(socketId) {
    const room = this.getRoomBySocket(socketId);
    const playerId = this.socketToPlayer.get(socketId);
    return room?.adminId === playerId;
  }
}
