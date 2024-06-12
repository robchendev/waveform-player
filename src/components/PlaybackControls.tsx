import { formatTime } from "@/utils/timeline";
import React from "react";
import { FaPause, FaPlay, FaStop, FaCut } from "react-icons/fa";
import { ImLoop } from "react-icons/im";
import { TiArrowLoop } from "react-icons/ti";
interface PlaybackControlsProps {
  onRegionCut: () => void;
  onPlayPause: () => void;
  onStop: () => void;
  onLoopCountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLoop: (val: boolean) => void;
  loop: boolean;
  loopInputValue: string | number;
  isPlaying: boolean;
  currentTime: number;
  audioLength: number;
}

const PlaybackButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    className="border-slate-500 border-2 rounded-md w-8 h-8 flex items-center justify-center bg-slate-700"
    onClick={onClick}
  >
    {children}
  </button>
);

const LoopButton = ({
  onClick,
  children,
  isOn,
}: {
  onClick: () => void;
  children: React.ReactNode;
  isOn: boolean;
}) => (
  <button
    className={`${
      isOn ? "bg-slate-700 border-slate-500" : "bg-slate-900 border-slate-500"
    }  border-2 rounded-md h-8 px-2 flex items-center justify-center`}
    onClick={onClick}
  >
    {children}
  </button>
);

const PlaybackControls = ({
  onRegionCut,
  onPlayPause,
  onStop,
  onLoopCountChange,
  setLoop,
  loop,
  loopInputValue,
  isPlaying,
  currentTime,
  audioLength,
}: PlaybackControlsProps) => {
  return (
    <div className="flex gap-2 items-center  self-center">
      <PlaybackButton onClick={onPlayPause}>{isPlaying ? <FaPause /> : <FaPlay />}</PlaybackButton>
      <PlaybackButton onClick={onStop}>
        <FaStop />
      </PlaybackButton>
      <PlaybackButton onClick={onRegionCut}>
        <FaCut />
      </PlaybackButton>
      <LoopButton isOn={loop} onClick={() => setLoop(!loop)}>
        <div className="flex gap-1 items-center">
          <ImLoop />
          <input
            className={`mx-1 text-black w-12 text-center ${!loop && "bg-slate-500"}`}
            type="text"
            value={loopInputValue}
            onChange={onLoopCountChange}
            placeholder="inf"
            onClick={(e) => {
              e.stopPropagation();
              setLoop(true);
            }}
          />
          times
        </div>
      </LoopButton>
      <p className="w-10">{formatTime(currentTime)}</p>
      <p className="w-[1px]">/</p>
      <p className="w-10">{formatTime(audioLength)}</p>
    </div>
  );
};

export default PlaybackControls;
