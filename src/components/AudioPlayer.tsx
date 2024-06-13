import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import TimelinePlugin from "wavesurfer.js/plugins/timeline";
import { useRegions } from "@/hooks/useRegions";
import PlaybackControls from "./PlaybackControls";
import { CutRegion, CutRegionPercent } from "../types";

interface AudioUploaderProps {
  audioSrc: string;
}

const AudioPlayer = ({ audioSrc }: AudioUploaderProps) => {
  const [loop, setLoop] = useState(false);
  const [loopCount, setLoopCount] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cutRegions, setCutRegions] = useState<CutRegionPercent[]>([]); // Decimal and Percent
  const [currentCutRegion, setCurrentCutRegion] = useState<CutRegion | null>(null); // Decimal

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    waveColor: "#C800C8",
    progressColor: "#640064",
    cursorColor: "#fff",
    url: audioSrc,
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
    if (!isNaN(numericValue)) {
      if (numericValue === 0) {
        setLoopCount(-1);
        setLoop(false);
      }
      if (numericValue > 0) {
        setLoopCount(numericValue);
      }
    } else if (value === "") {
      setLoopCount(-1);
    }
  };

  const onRegionCut = () => {
    const event = new Event("region-cut");
    containerRef.current?.dispatchEvent(event);
  };

  useEffect(() => {
    if (!currentCutRegion || !wavesurfer) {
      return;
    }

    // Calculate display percentage of start and end locators
    const audioEnd = wavesurfer.getDuration();
    const locatorPercentStart = (100 * currentCutRegion.start) / audioEnd;
    const locatorPercentEnd = (100 * currentCutRegion.end) / audioEnd;
    setCutRegions((cr) => [
      ...cr,
      {
        start: currentCutRegion.start,
        end: currentCutRegion.end,
        startPercent: locatorPercentStart,
        endPercent: locatorPercentEnd,
      },
    ]);
  }, [currentCutRegion, wavesurfer]);

  useEffect(() => {
    const isInCutRegion = cutRegions.some(
      (region) => currentTime >= region.start && currentTime <= region.end
    );
    wavesurfer?.setMuted(isInCutRegion);
  }, [wavesurfer, cutRegions, currentTime]);

  return (
    <>
      <div className="relative w-full h-[100px] mt-3">
        <div ref={containerRef} className="absolute w-full h-full" />
        {cutRegions.map((region: CutRegionPercent, index: number) => (
          <div
            key={index}
            className="absolute top-0 bg-slate-800 text-white pointer-events-none z-20 flex items-center h-full"
            style={{
              left: `${region.startPercent}%`,
              width: `${region.endPercent - region.startPercent}%`,
            }}
          >
            <div className="h-px bg-[#C800C8] w-full" />
          </div>
        ))}
      </div>
      <div className="relative z-30 bg-slate-900 p-3 rounded-lg">
        <PlaybackControls
          onPlayPause={onPlayPause}
          onStop={onStop}
          onLoopCountChange={onLoopCountChange}
          setLoop={setLoop}
          loop={loop}
          loopInputValue={!loop ? 0 : loopCount === -1 ? "" : loopCount}
          isPlaying={isPlaying}
          onRegionCut={onRegionCut}
          currentTime={currentTime}
          audioLength={wavesurfer?.getDuration() ?? 0}
        />
      </div>
    </>
  );
};

export default AudioPlayer;
