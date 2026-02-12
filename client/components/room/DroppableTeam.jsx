'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DraggablePlayer from './DraggablePlayer';

export default function DroppableTeam({ team, players, isAdmin, onDrop, draggedPlayer, label }) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (isAdmin) setIsOver(true);
  };

  const handleDragLeave = () => setIsOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const playerId = e.dataTransfer.getData('playerId');
    if (playerId) onDrop(playerId, team?.id ?? null);
  };

  const bgColor = team ? { backgroundColor: `${team.color}20`, borderColor: team.color } : {};
  const borderStyle = team ? { borderWidth: 2, borderStyle: 'solid' } : {};

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-2xl p-4 min-w-[200px] min-h-[120px] transition-all ${
        isOver ? 'drop-target scale-[1.02]' : ''
      } ${!team ? 'glass border border-dashed border-white/20' : ''}`}
      style={{ ...bgColor, ...borderStyle }}
    >
      <h3 className="font-semibold mb-3 text-sm">
        {team ? team.name : (label || 'Sem time')}
        {team && <span className="ml-2 text-gray-400">({players.length})</span>}
      </h3>
      <div className="flex flex-wrap gap-2">
        {players.map((player) => (
          <DraggablePlayer
            key={player.id}
            player={player}
            isAdmin={isAdmin}
            onDragStart={() => {}}
          />
        ))}
      </div>
    </motion.div>
  );
}
