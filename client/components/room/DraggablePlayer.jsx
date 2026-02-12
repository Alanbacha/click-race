'use client';

import { motion } from 'framer-motion';

export default function DraggablePlayer({ player, isAdmin, onDragStart }) {
  if (!isAdmin) {
    return (
      <div className="px-4 py-2 rounded-xl bg-white/5 text-sm">
        {player.name}
      </div>
    );
  }

  return (
    <motion.div
      draggable
      onDragStart={(e) => {
        onDragStart?.(player);
        e.dataTransfer.setData('playerId', player.id);
      }}
      className="px-4 py-2 rounded-xl bg-white/10 cursor-grab active:cursor-grabbing hover:bg-white/15 transition-colors"
    >
      {player.name}
    </motion.div>
  );
}
