'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSocket } from '@/contexts/SocketContext';
import RoomLobby from '@/components/room/RoomLobby';
import TeamSelection from '@/components/room/TeamSelection';
import GameView from '@/components/game/GameView';
import RoundEnd from '@/components/game/RoundEnd';

function RoomContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const socket = useSocket();
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const code = searchParams.get('code');
  const adminParam = searchParams.get('admin');

  useEffect(() => {
    if (!code || !socket) return;

    socket.on('room_update', (data) => {
      setRoom(data);
    });

    const storedRoom = sessionStorage.getItem(`room_${code}`);
    const storedPlayer = sessionStorage.getItem(`player_${code}`);
    if (storedRoom) setRoom(JSON.parse(storedRoom));
    if (storedPlayer) {
      const p = JSON.parse(storedPlayer);
      setPlayer(p);
      setIsAdmin(adminParam === '1');
    }

    return () => {
      socket.off('room_update');
    };
  }, [code, socket, adminParam]);

  useEffect(() => {
    if (room && player) {
      sessionStorage.setItem(`room_${code}`, JSON.stringify(room));
      sessionStorage.setItem(`player_${code}`, JSON.stringify(player));
    }
  }, [room, player, code]);

  if (!room || !player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Carregando sala...</div>
      </div>
    );
  }

  const currentPlayer = room.players.find(p => p.id === player.id);
  const isAdminCheck = room.adminId === player.id;

  if (room.gameState === 'lobby') {
    return (
      <RoomLobby
        room={room}
        player={currentPlayer || player}
        isAdmin={isAdminCheck}
      />
    );
  }

  if (room.gameState === 'team_selection') {
    return (
      <TeamSelection
        room={room}
        player={currentPlayer || player}
        isAdmin={isAdminCheck}
      />
    );
  }

  if (room.gameState === 'round_end' || room.gameState === 'game_over') {
    return (
      <RoundEnd
        room={room}
        player={currentPlayer || player}
        isAdmin={isAdminCheck}
      />
    );
  }

  if (room.gameState === 'game') {
    return (
      <GameView
        room={room}
        player={currentPlayer || player}
        isAdmin={isAdminCheck}
      />
    );
  }

  return null;
}

export default function RoomPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Carregando...</div>
      </div>
    }>
      <RoomContent />
    </Suspense>
  );
}
