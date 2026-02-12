'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSocket } from '@/contexts/SocketContext';

export default function RoundEnd({ room, player, isAdmin }) {
  const socket = useSocket();

  const winner = room.roundWinner ? room.players?.find(p => p.id === room.roundWinner) : null;
  const winnerTeam = winner ? room.teams?.find(t => t.id === winner.teamId) : null;
  const maxScore = Math.max(...(room.teams?.map(t => t.score) || [0]), 0);
  const gameOver = room.gameState === 'game_over' || maxScore >= room.targetScore;

  const handleNextRound = () => {
    socket.emit('next_round');
  };

  if (gameOver) {
    const winningTeam = room.teams?.length
      ? room.teams.reduce((a, b) => (a.score >= b.score ? a : b))
      : null;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-4">Fim de Jogo!</h1>
          <p className="text-2xl mb-2" style={{ color: winningTeam?.color }}>
            {winningTeam?.name} venceu!
          </p>
          <div className="mt-8 space-y-2">
            {room.teams?.map((team) => (
              <div key={team.id} className="flex items-center justify-center gap-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <span>{team.name}: {team.score} pts</span>
              </div>
            ))}
          </div>
        </motion.div>
        <Link href="/" className="mt-8 inline-block text-cyan-400 hover:text-cyan-300">
          ← Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-2">Rodada encerrada!</h2>
        <p className="text-gray-400 mb-6">
          {winner?.name} (+{room.roundPoints} pts para {winnerTeam?.name})
        </p>

        <div className="space-y-2 mb-8">
          {room.teams?.map((team) => (
            <div key={team.id} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <span>{team.name}</span>
              </div>
              <span className="font-bold">{team.score} / {room.targetScore}</span>
            </div>
          ))}
        </div>

        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNextRound}
            className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-bold hover:bg-cyan-400"
          >
            Próxima Rodada
          </motion.button>
        )}

        {!isAdmin && (
          <p className="text-center text-gray-400">Aguardando admin iniciar próxima rodada...</p>
        )}
      </motion.div>
    </div>
  );
}
