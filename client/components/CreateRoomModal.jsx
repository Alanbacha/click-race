'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/contexts/SocketContext';

export default function CreateRoomModal({ playerName, onClose }) {
  const [isPrivate, setIsPrivate] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const socket = useSocket();

  const handleCreate = () => {
    setError('');
    if (isPrivate && password.length < 4) {
      setError('Senha deve ter pelo menos 4 caracteres');
      return;
    }
    setLoading(true);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/52dfa0eb-968d-4933-8c3b-938ecdff2203',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CreateRoomModal.jsx:handleCreate','message':'before emit create_room',data:{socketId:socket?.id,connected:socket?.connected,playerName:playerName?.trim()},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    socket.emit('create_room', {
      playerName: playerName.trim(),
      isPrivate,
      password: isPrivate ? password : null,
    }, (response) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/52dfa0eb-968d-4933-8c3b-938ecdff2203',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CreateRoomModal.jsx:callback','message':'create_room callback',data:{hasResponse:!!response,success:response?.success,error:response?.error},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
      // #endregion
      setLoading(false);
      if (response?.success) {
        sessionStorage.setItem(`room_${response.room.code}`, JSON.stringify(response.room));
        sessionStorage.setItem(`player_${response.room.code}`, JSON.stringify(response.player));
        router.push(`/room?code=${response.room.code}&admin=1`);
        onClose();
      } else {
        setError(response?.error || 'Erro ao criar sala');
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
          <h2 className="text-2xl font-bold">Criar Sala</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400 mb-3">Tipo da sala</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="roomType"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                  className="accent-cyan-500"
                />
                <span>Pública</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="roomType"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                  className="accent-cyan-500"
                />
                <span>Privada</span>
              </label>
            </div>
          </div>

          <AnimatePresence>
            {isPrivate && (
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
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/5"
            >
              Cancelar
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
