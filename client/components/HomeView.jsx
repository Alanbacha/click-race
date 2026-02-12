'use client';

import { motion } from 'framer-motion';

export default function HomeView({ playerName, onNameChange, onCreateRoom, onJoinRoom }) {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-2">
          <span className="bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse-slow">
            CLICK
          </span>
          <br />
          <span className="text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">RACE</span>
        </h1>
        <p className="text-gray-400 text-lg mt-4">Quem clica primeiro? 🏁</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-3xl p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Seu nome
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Digite seu nome..."
            className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 
              focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 outline-none
              placeholder:text-gray-600 transition-all text-lg"
            maxLength={20}
          />
        </div>

        <div className="grid gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateRoom}
            disabled={!playerName.trim()}
            className="w-full py-4 px-6 rounded-2xl font-bold text-lg
              bg-gradient-to-r from-cyan-500 to-cyan-600 text-black
              hover:from-cyan-400 hover:to-cyan-500
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              transition-all shadow-lg shadow-cyan-500/25"
          >
            ✨ Criar Sala
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onJoinRoom}
            disabled={!playerName.trim()}
            className="w-full py-4 px-6 rounded-2xl font-bold text-lg
              glass glass-hover border-neon-pink/50 text-pink-400
              hover:border-pink-400 hover:shadow-lg hover:shadow-pink-500/20
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              transition-all"
          >
            🎯 Entrar na Sala
          </motion.button>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-gray-500 text-sm"
      >
        Convide amigos e veja quem é o mais rápido!
      </motion.p>
    </div>
  );
}
