'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/contexts/SocketContext';

export default function JoinRoomModal({ playerName, onClose }) {
  const [roomCode, setRoomCode] = useState('');
  const [password, setPassword] = useState('');
  const [needPassword, setNeedPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const socket = useSocket();

  const handleJoin = () => {
    setError('');
    if (!roomCode.trim()) {
      setError('Digite o código da sala');
      return;
    }
    setLoading(true);

    socket.emit('join_room', {
      roomCode: roomCode.trim().toUpperCase(),
      playerName: playerName.trim(),
      password: needPassword ? password : null,
    }, (response) => {
      setLoading(false);
      if (response?.success) {
        sessionStorage.setItem(`room_${response.room.code}`, JSON.stringify(response.room));
        sessionStorage.setItem(`player_${response.room.code}`, JSON.stringify(response.player));
        router.push(`/room?code=${response.room.code}&admin=${response.isAdmin ? 1 : 0}`);
        onClose();
      } else {
        if (response?.error === 'Senha incorreta') {
          setNeedPassword(true);
        }
        setError(response?.error || 'Erro ao entrar');
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-3xl p-8 max-w-md w-full border border-white/10"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Entrar na Sala</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">×</button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Código da sala</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Ex: A1B2C3"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none font-mono text-lg uppercase"
              maxLength={6}
            />
          </div>

          <AnimatePresence>
            {(needPassword || error === 'Senha incorreta') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <label className="block text-sm text-gray-400 mb-2">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha da sala"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/5">
              Cancelar
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-400 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
