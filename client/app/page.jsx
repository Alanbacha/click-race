'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeView from '@/components/HomeView';
import CreateRoomModal from '@/components/CreateRoomModal';
import JoinRoomModal from '@/components/JoinRoomModal';

export default function HomePage() {
  const [playerName, setPlayerName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <HomeView
          playerName={playerName}
          onNameChange={setPlayerName}
          onCreateRoom={() => setShowCreateModal(true)}
          onJoinRoom={() => setShowJoinModal(true)}
        />
      </motion.div>

      <AnimatePresence>
        {showCreateModal && (
          <CreateRoomModal
            playerName={playerName}
            onClose={() => setShowCreateModal(false)}
          />
        )}
        {showJoinModal && (
          <JoinRoomModal
            playerName={playerName}
            onClose={() => setShowJoinModal(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
