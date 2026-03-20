
import React, { useState, useEffect } from 'react';
import TimerCard from './components/TimerCard';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

const EXAM_TYPES = [
  { name: 'Sequenzdiagramm', minutes: 30 },
  { name: 'Aktivitätsdiagramm', minutes: 37 },
  { name: 'Zustandsdiagramm', minutes: 33 },
];

const generateTimers = () => {
  const timers = [];
  let idCounter = 1;
  EXAM_TYPES.forEach(exam => {
    timers.push({
      id: idCounter++,
      group: exam.name,
      // Simplified titles for the cards themselves
      title: 'Standard',
      isExtended: false,
      minutes: exam.minutes,
      initialSeconds: exam.minutes * 60
    });
    const extendedMinutes = exam.minutes * 1.25;
    timers.push({
      id: idCounter++,
      group: exam.name,
      // Simplified titles for the cards themselves
      title: '+25% Zeit',
      isExtended: true,
      minutes: extendedMinutes,
      initialSeconds: Math.floor(extendedMinutes * 60)
    });
  });
  return timers;
};

const INITIAL_TIMERS = generateTimers();

function App() {
  const [startTimeStr, setStartTimeStr] = useState("09:48");

  const [timers, setTimers] = useState(INITIAL_TIMERS.map(t => ({
    ...t,
    remainingSeconds: t.initialSeconds,
    isRunning: false,
    deadline: new Date()
  })));

  useEffect(() => {
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const updateTimerState = () => {
      const now = new Date();
      let elapsedMs = now - startDate;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);

      setTimers(currentTimers =>
        currentTimers.map(t => {
          let remaining = t.initialSeconds - elapsedSeconds;

          if (remaining > t.initialSeconds) {
            remaining = t.initialSeconds;
          }
          if (remaining < 0) remaining = 0;

          const deadline = new Date(startDate.getTime() + t.initialSeconds * 1000);

          return {
            ...t,
            deadline,
            remainingSeconds: remaining,
            isRunning: remaining > 0 && elapsedSeconds >= 0
          };
        })
      );
    };

    updateTimerState();
    const interval = setInterval(updateTimerState, 1000);

    return () => clearInterval(interval);
  }, [startTimeStr]);

  const handleStartTimeChange = (e) => {
    setStartTimeStr(e.target.value);
  };

  const setNow = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    setStartTimeStr(timeString);
  };

  return (
    // "h-screen" and "overflow-hidden" to force single screen dashboard feel
    <div className="h-screen w-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden flex flex-col p-4">

      {/* Compact Header */}
      <header className="flex-none flex items-center justify-between mb-4 bg-slate-800/20 p-3 rounded-2xl border border-white/5">
        <div>
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            PRÜFUNGS-TIMER
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-1 rounded-xl border border-white/10 shadow-inner">
            <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Start</span>
            <input
              type="time"
              value={startTimeStr}
              onChange={handleStartTimeChange}
              className="bg-transparent text-2xl font-mono font-bold text-white outline-none w-24 text-center cursor-pointer hover:text-cyan-400 transition-colors"
            />
          </div>
          <button
            onClick={setNow}
            className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-cyan-400 transition-colors"
          >
            JETZT SETZEN
          </button>
        </div>
      </header>

      {/* Main Grid - Flex Grow to fill remaining height */}
      <div className="flex-grow grid grid-rows-3 gap-2">
        {EXAM_TYPES.map((examType) => {
          const groupTimers = timers.filter(t => t.group === examType.name);

          return (
            <div key={examType.name} className="flex flex-col bg-slate-800/10 rounded-2xl border border-white/5 overflow-hidden">
              {/* Massive Group Label */}
              <div className="bg-slate-800/40 px-6 py-1 flex items-center">
                <h2 className="text-3xl font-black text-slate-200 tracking-tight uppercase flex-grow">
                  {examType.name}
                </h2>
                {/* Optional: Show base duration here? */}
                <span className="text-slate-500 font-mono text-xl font-bold">{examType.minutes} min</span>
              </div>

              {/* Timer Row */}
              <div className="flex-grow grid grid-cols-2 divide-x divide-white/5">
                {groupTimers.map(timer => (
                  <TimerCard
                    key={timer.id}
                    {...timer}
                    initialMinutes={timer.minutes}
                    disableControls={true}
                    onLabelChange={() => { }}
                    onDurationChange={() => { }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default App;
