'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSocket } from '@/contexts/SocketContext';
import DroppableTeam from './DroppableTeam';

export default function TeamSelection({ room, player, isAdmin }) {
  const [targetScore, setTargetScore] = useState(100);
  const [roundDuration, setRoundDuration] = useState(30);
  const [roundCountdown, setRoundCountdown] = useState(3);
  const socket = useSocket();

  const playersByTeam = room.playersByTeam || {};
  const unassigned = playersByTeam.unassigned || [];
  const teams = room.teams || [];

  const handleDrop = (playerId, teamId) => {
    socket.emit('move_player', { playerId, teamId });
  };

  const handleShuffle = () => {
    socket.emit('shuffle_teams');
  };

  const handleStartGame = () => {
    const allAssigned = room.players?.every(p => p.teamId !== null && p.teamId !== undefined);
    if (!allAssigned) return;
    socket.emit('start_game', {
      targetScore,
      roundDuration,
      roundCountdown,
    });
  };

  const allAssigned = room.players?.every(p => p.teamId !== null && p.teamId !== undefined);

  return (
    <div className="min-h-screen p-6">
      <Link href="/" className="absolute top-4 left-4 text-gray-400 hover:text-white text-sm z-10">
        ← Voltar
      </Link>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/3 space-y-4">
            <div className="glass rounded-2xl p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-mono text-cyan-400 font-bold">{room.code}</span>
                {isAdmin && room.isPrivate && (
                  <span className="text-sm text-gray-400">Senha: {room.password}</span>
                )}
              </div>
            </div>

            {isAdmin && (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="glass rounded-2xl p-4 space-y-3"
                >
                  <h3 className="font-semibold">Configurações do jogo</h3>
                  <div>
                    <label className="text-sm text-gray-400">Pontos para vencer</label>
                    <input
                      type="number"
                      value={targetScore}
                      onChange={(e) => setTargetScore(Number(e.target.value))}
                      min={10}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Duração da rodada (seg)</label>
                    <input
                      type="number"
                      value={roundDuration}
                      onChange={(e) => setRoundDuration(Number(e.target.value))}
                      min={5}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Delay antes do botão (seg)</label>
                    <input
                      type="number"
                      value={roundCountdown}
                      onChange={(e) => setRoundCountdown(Number(e.target.value))}
                      min={0}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 mt-1"
                    />
                  </div>
                </motion.div>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleShuffle}
                    className="flex-1 py-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/50 hover:bg-purple-500/30 font-medium"
                  >
                    🎲 Shuffle
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStartGame}
                    disabled={!allAssigned}
                    className="flex-1 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 disabled:opacity-50"
                  >
                    Iniciar Jogo
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-2/3 flex flex-wrap gap-4">
            <DroppableTeam
              team={null}
              players={unassigned}
              isAdmin={isAdmin}
              onDrop={handleDrop}
              label="Sem time"
            />
            {teams.map((team) => (
              <DroppableTeam
                key={team.id}
                team={team}
                players={playersByTeam[team.id] || []}
                isAdmin={isAdmin}
                onDrop={handleDrop}
              />
            ))}
          </div>
        </div>

        {!isAdmin && (
          <p className="text-center text-gray-400 mt-8">
            Visualizando em tempo real • {player?.name}
          </p>
        )}
      </motion.div>
    </div>
  );
}
