import React from 'react';

const PlayerCard = ({ player }) => {
  return (
    <div className="relative w-64 h-80 rounded-2xl overflow-hidden group shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 hover:border-cyan-400/50 transition-all duration-300">
      
      {/* Background Neon Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 z-10" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent transition-opacity duration-500 z-10" />
      
      {/* Player Image */}
      <img
        src={player.image}
        alt={player.name}
        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        onError={(e) => { e.target.src = '/players/default-avatar.png'; }}
      />
      
      {/* Team Badge */}
      <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white uppercase tracking-widest shadow-[0_0_10px_rgba(255,255,255,0.1)]">
        {player.team}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        
        {/* Role Badge */}
        <p className="text-[10px] font-semibold tracking-[0.2em] text-cyan-400 uppercase mb-1 drop-shadow-md">
          {player.role}
        </p>
        
        {/* Player Name */}
        <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-lg [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">
          {player.name}
        </h3>
        
        {/* Decorative Tech Element */}
        <div className="h-1 w-12 bg-gradient-to-r from-cyan-400 to-purple-500 mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
      </div>
    </div>
  );
};

export default PlayerCard;
