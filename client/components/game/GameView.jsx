'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/contexts/SocketContext';

export default function GameView({ room, player, isAdmin }) {
  const [timeLeft, setTimeLeft] = useState(room.roundDuration || 30);
  const [countdown, setCountdown] = useState(null);
  const socket = useSocket();

  const winner = room.roundWinner ? room.players?.find(p => p.id === room.roundWinner) : null;
  const winnerTeam = winner ? room.teams?.find(t => t.id === winner.teamId) : null;
  const canClick = room.roundState === 'active' && !room.roundWinner;
  const isCountingDown = room.roundState === 'countdown';

  useEffect(() => {
    if (room.roundState === 'countdown' && !countdown) {
      setCountdown(room.roundCountdown || 3);
    }
    if (room.roundState === 'active') {
      setCountdown(null);
      setTimeLeft(room.roundDuration || 30);
    }
  }, [room.roundState, room.roundCountdown, room.roundDuration]);

  useEffect(() => {
    if (countdown > 0 && isCountingDown) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown, isCountingDown]);

  useEffect(() => {
    if (room.roundState === 'active' && timeLeft > 0 && !room.roundWinner) {
      const t = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) socket.emit('round_timeout');
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [room.roundState, timeLeft, room.roundWinner, socket]);

  const handleClick = () => {
    if (canClick) socket.emit('player_click');
  };

  const handleStartRound = () => {
    if (isAdmin && room.roundState === 'waiting') {
      socket.emit('start_round');
    }
  };

  const bgColor = winnerTeam?.color || '#0a0a0f';

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500"
      style={{ backgroundColor: room.roundWinner ? bgColor : undefined }}
    >
      <Link href="/" className="absolute top-4 left-4 text-gray-400 hover:text-white text-sm z-10">
        ← Sair
      </Link>
      <div className="absolute top-4 left-16 right-4 flex justify-between items-center">
        <div className="flex gap-4">
          {room.teams?.map((team) => (
            <div key={team.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: team.color }}
              />
              <span className="text-sm font-medium">{team.name}: {team.score}</span>
            </div>
          ))}
        </div>
        <span className="text-gray-400">Rodada {room.currentRound}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {room.roundState === 'waiting' && isAdmin && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <AdminRoundConfig
                room={room}
                onConfigChange={(config) => socket.emit('update_config', config)}
              />
              <p className="text-xl text-gray-400 mb-6 mt-4">Todos prontos?</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartRound}
                className="px-12 py-4 rounded-2xl bg-cyan-500 text-black font-bold text-xl"
              >
                Iniciar Rodada
              </motion.button>
            </motion.div>
          )}

          {room.roundState === 'waiting' && !isAdmin && (
            <motion.p
              key="waiting-player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl text-gray-400"
            >
              Aguardando o admin iniciar a rodada...
            </motion.p>
          )}

          {isCountingDown && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-6xl font-bold text-white">{countdown || '...'}</p>
              <p className="text-gray-400 mt-2">Prepare-se!</p>
            </motion.div>
          )}

          {(room.roundState === 'active' || room.roundWinner) && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center"
            >
              {(room.roundWinner || (room.roundState === 'ended' && timeLeft <= 0)) ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-6xl font-bold text-white mb-2">
                    {winner?.name || 'Tempo esgotado!'}
                  </p>
                  <p className="text-xl text-white/80">
                    {winner ? 'clicou primeiro!' : 'Ninguém clicou a tempo'}
                  </p>
                  {isAdmin && (
                    <p className="text-gray-400 mt-4">Defina os pontos e encerre a rodada</p>
                  )}
                </motion.div>
              ) : (
                <>
                  <motion.button
                    whileHover={canClick ? { scale: 1.05 } : {}}
                    whileTap={canClick ? { scale: 0.95 } : {}}
                    onClick={handleClick}
                    disabled={!canClick}
                    className={`w-48 h-48 md:w-64 md:h-64 rounded-full font-bold text-2xl
                      ${canClick
                        ? 'bg-gradient-to-r from-cyan-400 to-pink-400 text-black cursor-pointer shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70'
                        : 'bg-white/10 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    CLIQUE!
                  </motion.button>
                  <p className="text-4xl font-mono font-bold mt-8 text-cyan-400">
                    {timeLeft}s
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {(room.roundWinner || (room.roundState === 'ended' && !room.roundWinner)) && isAdmin && (
        <RoundPointsForm
          onConfirm={(points) => {
            socket.emit('end_round', { points });
          }}
        />
      )}
    </div>
  );
}

function AdminRoundConfig({ room, onConfigChange }) {
  const [duration, setDuration] = useState(room.roundDuration || 30);
  const [countdown, setCountdown] = useState(room.roundCountdown || 3);

  const handleBlur = () => {
    onConfigChange({
      roundDuration: duration,
      roundCountdown: countdown,
    });
  };

  return (
    <div className="flex gap-4 justify-center text-sm">
      <div>
        <label className="text-gray-400 block">Timer (seg)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          onBlur={handleBlur}
          min={5}
          className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-center"
        />
      </div>
      <div>
        <label className="text-gray-400 block">Delay (seg)</label>
        <input
          type="number"
          value={countdown}
          onChange={(e) => setCountdown(Number(e.target.value))}
          onBlur={handleBlur}
          min={0}
          className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-center"
        />
      </div>
    </div>
  );
}

function RoundPointsForm({ onConfirm }) {
  const [points, setPoints] = useState(10);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 glass rounded-2xl p-6 flex items-center gap-4"
    >
      <div>
        <label className="text-sm text-gray-400 block">Pontos</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(Number(e.target.value))}
          min={1}
          className="w-24 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
        />
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => onConfirm(points)}
        className="py-3 px-6 rounded-xl bg-cyan-500 text-black font-bold"
      >
        Encerrar Rodada
      </motion.button>
    </motion.div>
  );
}
