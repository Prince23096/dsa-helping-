import React from 'react';
import { PlayIcon, PauseIcon, NextIcon, ResetIcon } from './IconComponents';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disableControls: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onReset,
  speed,
  onSpeedChange,
  disableControls,
}) => {
  const baseButtonClass = "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white shadow-md transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none";

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-3 bg-gray-950/50 rounded-md border border-gray-700/50">
      <button
        onClick={onReset}
        disabled={disableControls}
        className={`${baseButtonClass} bg-gray-700 hover:bg-gray-600 focus:ring-gray-600`}
        aria-label="Reset Animation"
      >
        <ResetIcon />
        Reset
      </button>
      
      {isPlaying ? (
        <button
          onClick={onPause}
          disabled={disableControls}
          className={`${baseButtonClass} bg-rose-600 hover:bg-rose-500 focus:ring-rose-500`}
          aria-label="Pause Animation"
        >
          <PauseIcon />
          Pause
        </button>
      ) : (
        <button
          onClick={onPlay}
          disabled={disableControls}
          className={`${baseButtonClass} bg-cyan-600 hover:bg-cyan-500 focus:ring-cyan-500`}
          aria-label="Play Animation"
        >
          <PlayIcon />
          Play
        </button>
      )}

      <button
        onClick={onNext}
        disabled={disableControls || isPlaying}
        className={`${baseButtonClass} bg-violet-500 hover:bg-violet-400 focus:ring-violet-400`}
        aria-label="Next Step"
      >
        <NextIcon />
        Next Step
      </button>

      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="speed" className="text-gray-400 font-medium">Speed:</label>
        <input
          id="speed"
          type="range"
          min="10"
          max="1000"
          step="10"
          value={1010 - speed}
          onChange={(e) => onSpeedChange(1010 - parseInt(e.target.value, 10))}
          className="w-24 md:w-32 cursor-pointer accent-cyan-500"
          disabled={disableControls}
          aria-label="Animation Speed"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
