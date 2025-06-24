import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Trash2 } from 'lucide-react';

interface LapTime {
  id: number;
  time: number;
  lapNumber: number;
}

function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  const lapCountRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          toggleStopwatch();
          break;
        case 'KeyR':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            resetStopwatch();
          }
          break;
        case 'KeyL':
          if (isRunning) {
            recordLap();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRunning, time]);

  const toggleStopwatch = () => {
    setIsRunning(!isRunning);
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setTime(0);
    setLapTimes([]);
    lapCountRef.current = 0;
  };

  const recordLap = () => {
    if (isRunning) {
      lapCountRef.current += 1;
      const newLap: LapTime = {
        id: Date.now(),
        time: time,
        lapNumber: lapCountRef.current,
      };
      setLapTimes(prev => [newLap, ...prev]);
    }
  };

  const clearLaps = () => {
    setLapTimes([]);
    lapCountRef.current = 0;
  };

  const formatTime = (milliseconds: number) => {
    const totalMs = Math.floor(milliseconds);
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const ms = Math.floor((totalMs % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const getButtonStyles = (type: 'start' | 'pause' | 'reset' | 'lap' | 'clear') => {
    const baseStyles = 'px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2';
    
    switch (type) {
      case 'start':
        return `${baseStyles} bg-gradient-to-r from-green-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white`;
      case 'pause':
        return `${baseStyles} bg-gradient-to-r from-red-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white`;
      case 'reset':
        return `${baseStyles} bg-gradient-to-r from-blue-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white`;
      case 'lap':
        return `${baseStyles} bg-gradient-to-r from-purple-500 to-purple-600 hover:from-violet-400 hover:to-purple-500 text-white`;
      case 'clear':
        return `${baseStyles} bg-gradient-to-r from-gray-500 to-gray-600 hover:from-slate-400 hover:to-gray-500 text-white`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Animated background elements with floating animation when not running */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl ${isRunning ? 'animate-pulse' : 'animate-float'}`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl ${isRunning ? 'animate-pulse' : 'animate-float-delayed'}`} style={{ animationDelay: '1s' }}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl ${isRunning ? 'animate-pulse' : 'animate-float-slow'}`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-cyan-300 hover:to-pink-400 transition-all duration-500 hover:text-7xl cursor-default">
            Stopwatch Pro
          </h1>
          <p className="text-slate-300 text-lg hover:text-white transition-all duration-300 cursor-default">Precision timing with elegant design</p>
        </div>

        {/* Circular Timer Display */}
        <div className="flex justify-center mb-8">
          <div className="relative w-96 h-96 md:w-[450px] md:h-[450px]">
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 opacity-75 hover:opacity-100 transition-opacity duration-500 animate-spin-slow"></div>
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-slate-900/90 via-blue-900/90 to-slate-900/90 backdrop-blur-lg"></div>
            
            {/* Heartbeat animation circle when running */}
            {isRunning && (
              <>
                <div className="absolute inset-8 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 animate-heartbeat"></div>
                <div className="absolute inset-12 rounded-full bg-gradient-to-r from-red-400/15 to-pink-400/15 animate-heartbeat-delayed"></div>
                <div className="absolute inset-16 rounded-full bg-gradient-to-r from-red-300/10 to-pink-300/10 animate-heartbeat-slow"></div>
              </>
            )}
            
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-8">
              {/* Timer Display */}
              <div className={`text-4xl md:text-5xl font-mono font-bold mb-8 tracking-wide text-white drop-shadow-lg hover:text-cyan-300 transition-all duration-500 cursor-default ${isRunning ? 'animate-pulse-subtle' : ''}`}>
                {formatTime(time)}
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  onClick={toggleStopwatch}
                  className={getButtonStyles(isRunning ? 'pause' : 'start')}
                  aria-label={isRunning ? 'Pause stopwatch' : 'Start stopwatch'}
                >
                  {isRunning ? <Pause size={20} /> : <Play size={20} />}
                  {isRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={resetStopwatch}
                  className={getButtonStyles('reset')}
                  aria-label="Reset stopwatch"
                >
                  <RotateCcw size={20} />
                  Reset
                </button>

                {isRunning && (
                  <button
                    onClick={recordLap}
                    className={getButtonStyles('lap')}
                    aria-label="Record lap time"
                  >
                    <Flag size={20} />
                    Lap
                  </button>
                )}
              </div>

              {/* Keyboard Shortcuts */}
              <div className="text-slate-400 text-sm hover:text-slate-200 transition-all duration-300 cursor-default">
                <p>Space (Start/Pause) • L (Lap) • Ctrl+R (Reset)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Lap Times Section */}
        {lapTimes.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 hover:text-cyan-300 transition-all duration-300 cursor-default">
                <Flag size={20} />
                Lap Times
              </h2>
              <button
                onClick={clearLaps}
                className={getButtonStyles('clear')}
                aria-label="Clear all lap times"
              >
                <Trash2 size={16} />
                Clear
              </button>
            </div>

            <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
              {lapTimes.map((lap, index) => (
                <div
                  key={lap.id}
                  className={`flex justify-between items-center p-3 rounded-lg transition-all duration-300 hover:bg-white/10 hover:scale-102 cursor-pointer ${
                    index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'
                  }`}
                >
                  <span className="font-medium text-slate-300 hover:text-white transition-colors duration-300">
                    Lap {lap.lapNumber}
                  </span>
                  <span className="font-mono text-lg font-bold text-white hover:text-cyan-300 transition-colors duration-300">
                    {formatTime(lap.time)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="text-blue-400 mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                <Play size={32} className="mx-auto group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan-300 transition-all duration-300">Precision Timing</h3>
              <p className="text-slate-400 text-sm group-hover:text-slate-200 transition-all duration-300">Accurate to 1/100th of a second for professional timing needs</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="text-purple-400 mb-2 group-hover:text-violet-300 transition-colors duration-300">
                <Flag size={32} className="mx-auto group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-violet-300 transition-all duration-300">Lap Tracking</h3>
              <p className="text-slate-400 text-sm group-hover:text-slate-200 transition-all duration-300">Record unlimited lap times with instant timestamps</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group">
              <div className="text-green-400 mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                <RotateCcw size={32} className="mx-auto group-hover:scale-110 transition-all duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-300 transition-all duration-300">Quick Controls</h3>
              <p className="text-slate-400 text-sm group-hover:text-slate-200 transition-all duration-300">Keyboard shortcuts and intuitive controls for efficient use</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.6);
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.6;
          }
        }
        
        @keyframes heartbeat-delayed {
          0%, 100% {
            transform: scale(1);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.4;
          }
        }
        
        @keyframes heartbeat-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        @keyframes float-slow {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-25px);
          }
        }
        
        @keyframes pulse-subtle {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-heartbeat {
          animation: heartbeat 1.2s ease-in-out infinite;
        }
        
        .animate-heartbeat-delayed {
          animation: heartbeat-delayed 1.2s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        
        .animate-heartbeat-slow {
          animation: heartbeat-slow 1.2s ease-in-out infinite;
          animation-delay: 0.4s;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
}

export default App;