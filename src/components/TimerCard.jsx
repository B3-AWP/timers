
import React, { useState, useEffect } from 'react';

const TimerCard = ({
    title,
    initialMinutes,
    remainingSeconds,
    deadline
}) => {
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        if (seconds < 180) {
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')} min`;
    };

    // Logic to show "Finished" or "Overtime"? 
    // For now just 00:00 or 00 min

    const isFinished = remainingSeconds === 0 && initialMinutes > 0;
    // Progress for background fill
    const progress100 = Math.min(100, Math.max(0, (remainingSeconds / (initialMinutes * 60)) * 100));

    const formatDeadline = (d) => d ? d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '--:--';

    return (
        <div className={`
      relative h-full flex flex-col justify-center items-center overflow-hidden group
      ${isFinished ? 'bg-red-900/20' : 'hover:bg-white/5'}
      transition-colors
    `}>

            {/* Subtle Progress Background (Vertical fill?) or Bottom bar? 
          User wants "Kacheln". A filling background is nice visually for distance.
      */}
            <div
                className={`absolute bottom-0 left-0 w-full bg-cyan-500/5 transition-all duration-1000 ease-linear pointer-events-none`}
                style={{ height: `${progress100}%` }}
            />

            {/* Content Container - Centered */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pb-2">

                {/* Label - HUGE */}
                <div className={`
          text-2xl font-black uppercase tracking-widest mb-0
          ${title.includes('+') ? 'text-amber-400' : 'text-cyan-400'}
        `}>
                    {title}
                </div>

                {/* Time - MASSIVE */}
                <div className={`
          font-mono font-bold leading-none tracking-tighter
          ${isFinished ? 'text-red-500 animate-pulse' : 'text-slate-100'}
          ${remainingSeconds < 180 ? 'text-[7vw] sm:text-[6rem]' : 'text-[8vw] sm:text-[7rem]'} 
          /* Dynamic sizing based on viewport width to ensure it fills but fits */
        `}>
                    {formatTime(remainingSeconds)}
                </div>

                {/* Deadline - Visible but smaller */}
                <div className="absolute top-2 right-4 bg-slate-900/80 px-3 py-1 rounded text-slate-400 font-mono text-xl font-bold">
                    Abgabe: <span className="text-white">{formatDeadline(deadline)}</span>
                </div>
            </div>
        </div>
    );
};

export default TimerCard;
