import React from "react";
import { CutRegion } from "../types";

interface PlaybackControlsProps {
  onRegionCut: () => void;
  onPlayPause: () => void;
  onStop: () => void;
  onLoopCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLoop: (val: boolean) => void;
  loop: boolean;
  loopInputValue: string | number;
  isPlaying: boolean;
}

const PlaybackControls = ({
  onRegionCut,
  onPlayPause,
  onStop,
  onLoopCountChange,
  setLoop,
  loop,
  loopInputValue,
  isPlaying,
}: PlaybackControlsProps) => {
  return (
    <div className="flex gap-2">
      <button onClick={onPlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={onStop}>Stop</button>
      <button onClick={onRegionCut}>Cut Region</button>
      <label>
        <input className="mr-1" type="checkbox" checked={loop} onChange={() => setLoop(!loop)} />
        Loop selection
      </label>
      <label>
        Limit loops:
        <input
          className="mx-1 text-black w-12 text-center"
          type="text"
          value={loopInputValue}
          onChange={onLoopCountChange}
          placeholder="inf"
        />
        Times
      </label>
    </div>
  );
};

export default PlaybackControls;
