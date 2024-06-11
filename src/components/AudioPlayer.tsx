import React, { useCallback, useMemo, useRef } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { formatTime } from "@/utils/timeline";

interface AudioUploaderProps {
  audioSrc: string;
}

const AudioPlayer = ({ audioSrc }: AudioUploaderProps) => {
  const containerRef = useRef(null);
  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "rgb(200, 0, 200)",
    progressColor: "rgb(100, 0, 100)",
    url: audioSrc,
    plugins: useMemo(() => [Timeline.create()], []),
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const onStop = useCallback(() => {
    wavesurfer && wavesurfer.stop();
  }, [wavesurfer]);

  return (
    <>
      <div ref={containerRef} />
      <p>Current time: {formatTime(currentTime)}</p>
      <div className="flex gap-2">
        <button onClick={onPlayPause}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={onStop}>Stop</button>
      </div>
    </>
  );
};

export default AudioPlayer;
