'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSocket } from '@/contexts/SocketContext';

export default function RoomLobby({ room, player, isAdmin }) {
  const [teamCount, setTeamCount] = useState(2);
  const socket = useSocket();

  const handleCreateTeams = () => {
    socket.emit('create_teams', { count: teamCount });
  };

  return (
    <div className="min-h-screen p-6">
      <Link href="/" className="absolute top-4 left-4 text-gray-400 hover:text-white text-sm">
        ← Voltar
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="glass rounded-3xl p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Sala {room.code}</h1>
              <p className="text-gray-400">{room.players?.length || 0} jogadores</p>
              {isAdmin && room.isPrivate && (
                <p className="text-sm text-cyan-400 mt-2">Senha: {room.password}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-400 font-mono text-lg">
                {room.code}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(room.code)}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm"
              >
                📋 Copiar
              </button>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 mb-6">
          <h2 className="text-lg font-semibold mb-4">Jogadores na sala</h2>
          <div className="flex flex-wrap gap-2">
            {room.players?.map((p) => (
              <span
                key={p.id}
                className={`px-4 py-2 rounded-xl ${
                  p.id === player?.id ? 'bg-cyan-500/30 text-cyan-300' : 'bg-white/5'
                }`}
              >
                {p.name} {p.id === room.adminId && '👑'}
              </span>
            ))}
          </div>
        </div>

        {isAdmin && (
          <div className="glass rounded-3xl p-8">
            <h2 className="text-lg font-semibold mb-4">Iniciar configuração</h2>
            <p className="text-gray-400 text-sm mb-4">
              Defina quantos times terão no jogo
            </p>
            <div className="flex items-center gap-4 mb-6">
              {[2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setTeamCount(n)}
                  className={`w-12 h-12 rounded-xl font-bold transition-all ${
                    teamCount === n
                      ? 'bg-cyan-500 text-black'
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateTeams}
              disabled={room.players?.length < 2}
              className="w-full py-4 rounded-2xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 disabled:opacity-50"
            >
              Criar {teamCount} times e organizar jogadores
            </motion.button>
          </div>
        )}

        {!isAdmin && (
          <p className="text-center text-gray-400 py-8">
            Aguardando o admin configurar os times...
          </p>
        )}
      </motion.div>
    </div>
  );
}
