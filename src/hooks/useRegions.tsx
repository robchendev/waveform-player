import { useEffect, useRef } from "react";
import RegionsPlugin, { Region } from "wavesurfer.js/plugins/regions";
import { CutRegion } from "../types";

export const useRegions = (
  wavesurfer: any,
  loop: boolean,
  loopCount: number,
  setCurrentCutRegion: (cutRegion: CutRegion) => void,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const wsRegionsRef = useRef<RegionsPlugin | null>(null);
  const activeRegionRef = useRef<Region | null>(null);
  const currentLoopIterationRef = useRef(1);
  const regionClickedRef = useRef(false);
  const regionLocatorRef = useRef<CutRegion | null>(null);

  const loopRef = useRef(loop);
  const loopCountRef = useRef(loopCount);

  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  useEffect(() => {
    loopCountRef.current = loopCount;
  }, [loopCount]);

  useEffect(() => {
    if (wavesurfer) {
      const regionsPlugin = wavesurfer.registerPlugin(RegionsPlugin.create());
      wsRegionsRef.current = regionsPlugin;
    }
  }, [wavesurfer, containerRef]);

  useEffect(() => {
    const wsRegions = wsRegionsRef.current;
    if (!wsRegions) return;

    const handleRegionCreated = (region: Region) => {
      setRegionLocators(region);
      if (wsRegions.getRegions().length > 1) {
        wsRegions.clearRegions();
        wsRegions.addRegion(region);
      }
      currentLoopIterationRef.current = 1;
    };

    const handleRegionIn = (region: Region) => {
      if (activeRegionRef.current !== region) {
        activeRegionRef.current = region;
        // @ts-ignore
        region.setOptions({ color: "rgba(255,255,255,0.18)" });
        currentLoopIterationRef.current = 1;
      }
      activeRegionRef.current = region;
    };

    const handleRegionClicked = (region: Region, e: MouseEvent) => {
      currentLoopIterationRef.current = 1;
      e.stopPropagation();
      activeRegionRef.current = region;
      regionClickedRef.current = true;
      region.play();
      // @ts-ignore
      region.setOptions({ color: "rgba(255,255,255,0.18)" });
    };

    const setRegionLocators = (region: Region) => {
      regionLocatorRef.current = { start: region.start, end: region.end };
    };

    const handleInteraction = () => {
      if (!regionClickedRef.current) {
        activeRegionRef.current = null;
        wsRegions.clearRegions();
        wavesurfer.play();
      } else {
        regionClickedRef.current = false;
      }
    };

    const handleRegionOut = (region: Region) => {
      if (activeRegionRef.current === region) {
        // Prevent region-out event handler from incrementing loops when the event was fired
        // by a region click or by looping back to the region start from region out
        if (regionClickedRef.current) {
          regionClickedRef.current = false;
          return;
        }
        // ? Bug: loop skipping
        // * 1. Make region
        // * 2. Turn on loop and set loop settings
        // * 3. Limit loop to 2 times

        if (loopRef.current) {
          if (loopCountRef.current === -1) {
            region.play();
          } else if (currentLoopIterationRef.current < loopCountRef.current) {
            currentLoopIterationRef.current += 1;
            region.play();
          } else {
            currentLoopIterationRef.current = 1;
          }
        }
      }
    };

    const handleRegionCut = (event: CustomEvent) => {
      console.log("Custom event 'region-cut' received:", event.detail.message);
      console.log(regionLocatorRef.current);

      if (regionLocatorRef.current) {
        setCurrentCutRegion(regionLocatorRef.current);
        regionLocatorRef.current = null;
        wsRegions.clearRegions();
      }
    };

    if (wsRegions.getRegions().length > 0) {
      wsRegions.clearRegions();
    }

    wsRegions.enableDragSelection({
      color: "rgba(255, 255, 255, 0.1)",
    });

    // Subscribe / unsubscribe when dependencies change
    wsRegions.on("region-updated", setRegionLocators);
    wsRegions.on("region-created", handleRegionCreated);
    wsRegions.on("region-in", handleRegionIn);
    wsRegions.on("region-clicked", handleRegionClicked);
    wsRegions.on("region-out", handleRegionOut);
    wavesurfer.on("interaction", handleInteraction);
    if (containerRef.current) {
      containerRef.current.addEventListener("region-cut", handleRegionCut as EventListener);
    }

    return () => {
      wsRegions.un("region-updated", setRegionLocators);
      wsRegions.un("region-created", handleRegionCreated);
      wsRegions.un("region-in", handleRegionIn);
      wsRegions.un("region-clicked", handleRegionClicked);
      wsRegions.un("region-out", handleRegionOut);
      wavesurfer.un("interaction", handleInteraction);
      wavesurfer.un("region-cut", handleRegionCut);
      if (containerRef.current) {
        // eslint-disable-next-line
        containerRef.current.removeEventListener("region-cut", handleRegionCut as EventListener);
      }
    };
  }, [wavesurfer, containerRef, setCurrentCutRegion]);

  return wsRegionsRef;
};
