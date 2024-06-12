import React, { useMemo, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import { formatTime } from "@/utils/timeline";
import { useRegions } from "@/hooks/useRegions";
import PlaybackControls from "./PlaybackControls";
interface AudioUploaderProps {
  audioSrc: string;
}

const AudioPlayer = ({ audioSrc }: AudioUploaderProps) => {
  const [loop, setLoop] = useState(false);
  const [loopCount, setLoopCount] = useState<number>(-1);
  const containerRef = useRef(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    url: audioSrc,
    plugins: useMemo(() => [TimelinePlugin.create()], []),
  });

  const wsRegionsRef = useRegions(wavesurfer, loop, loopCount);

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const onStop = () => {
    wsRegionsRef.current?.clearRegions();
    wavesurfer && wavesurfer.stop();
  };

  const onLoopCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setLoopCount(-1);
      return;
    }
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue > 0) {
      setLoopCount(numericValue);
    } else if (value === "") {
      setLoopCount(-1);
    }
  };

  return (
    <>
      <div ref={containerRef} />
      <p>Current time: {formatTime(currentTime)}</p>
      <PlaybackControls
        onPlayPause={onPlayPause}
        onStop={onStop}
        onLoopCountChange={onLoopCountChange}
        setLoop={setLoop}
        loop={loop}
        loopInputValue={loopCount === -1 ? "" : loopCount}
        isPlaying={isPlaying}
      />
    </>
  );
};

export default AudioPlayer;
