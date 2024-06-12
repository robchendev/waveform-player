import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import { formatTime } from "@/utils/timeline";
import { useRegions } from "@/hooks/useRegions";
import PlaybackControls from "./PlaybackControls";
import { CutRegion } from "../types";

interface AudioUploaderProps {
  audioSrc: string;
}

const AudioPlayer = ({ audioSrc }: AudioUploaderProps) => {
  const [loop, setLoop] = useState(false);
  const [loopCount, setLoopCount] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutRegions, setCutRegions] = useState<CutRegion[]>([]); // Percent
  const [currentCutRegion, setCurrentCutRegion] = useState<CutRegion | null>(null); // Decimal

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "#C800C8",
    progressColor: "#640064",
    cursorColor: "#fff",
    url: audioSrc,
    plugins: useMemo(() => [TimelinePlugin.create()], []),
  });

  const wsRegionsRef = useRegions(wavesurfer, loop, loopCount, setCurrentCutRegion, containerRef);

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

  const onRegionCut = () => {
    console.log("region-cut");
    const event = new CustomEvent("region-cut", {
      detail: {
        message: "Region cut event triggered",
      },
    });
    if (containerRef.current) {
      containerRef.current.dispatchEvent(event);
    }
  };

  useEffect(() => {
    if (!currentCutRegion || !wavesurfer) {
      return;
    }
    console.log("currentCutRegion:", currentCutRegion);
    console.log(wavesurfer?.getDuration());

    // Calculate display percentage of start and end locators
    const audioEnd = wavesurfer.getDuration();
    const locatorPercentStart = (100 * currentCutRegion.start) / audioEnd;
    const locatorPercentEnd = (100 * currentCutRegion.end) / audioEnd;
    console.log(locatorPercentStart, locatorPercentEnd);
    setCutRegions((cr) => [...cr, { start: locatorPercentStart, end: locatorPercentEnd }]);
  }, [currentCutRegion, wavesurfer]);

  return (
    <>
      <div className="relative w-full h-[100px]">
        <div ref={containerRef} className="absolute w-full h-full" />
        {cutRegions.map((region, index) => (
          <div
            key={index}
            className="absolute top-0 bg-slate-800 text-white pointer-events-none z-20 flex items-center h-full"
            style={{
              left: `${region.start}%`,
              width: `${region.end - region.start}%`,
            }}
          >
            <div className="h-px bg-[#C800C8] w-full" />
          </div>
        ))}
      </div>
      <div className="relative z-30 p-4 bg-gray-900">
        <p>Current time: {formatTime(currentTime)}</p>
        <PlaybackControls
          onPlayPause={onPlayPause}
          onStop={onStop}
          onLoopCountChange={onLoopCountChange}
          setLoop={setLoop}
          loop={loop}
          loopInputValue={loopCount === -1 ? "" : loopCount}
          isPlaying={isPlaying}
          onRegionCut={onRegionCut}
        />
      </div>
    </>
  );
};

export default AudioPlayer;
