import { useEffect, useRef } from "react";
import RegionsPlugin, { Region } from "wavesurfer.js/plugins/regions";

export const useRegions = (wavesurfer: any, loop: boolean, loopCount: number) => {
  const wsRegionsRef = useRef<RegionsPlugin | null>(null);
  const activeRegionRef = useRef<Region | null>(null);
  const currentLoopIterationRef = useRef(1);
  const regionClickedRef = useRef(false);

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
  }, [wavesurfer]);

  useEffect(() => {
    const wsRegions = wsRegionsRef.current;
    if (!wsRegions) return;

    const handleRegionCreated = (region: Region) => {
      notifyRegionLocators(region);
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

    const notifyRegionLocators = (region: Region) => {
      console.log("Region Locators:", region.start, region.end);
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

    if (wsRegions.getRegions().length > 0) {
      wsRegions.clearRegions();
    }

    wsRegions.enableDragSelection({
      color: "rgba(255, 255, 255, 0.1)",
    });

    // Subscribe / unsubscribe when dependencies change
    wsRegions.on("region-updated", notifyRegionLocators);
    wsRegions.on("region-created", handleRegionCreated);
    wsRegions.on("region-in", handleRegionIn);
    wsRegions.on("region-clicked", handleRegionClicked);
    wsRegions.on("region-out", handleRegionOut);
    wavesurfer.on("interaction", handleInteraction);

    return () => {
      wsRegions.un("region-updated", notifyRegionLocators);
      wsRegions.un("region-created", handleRegionCreated);
      wsRegions.un("region-in", handleRegionIn);
      wsRegions.un("region-clicked", handleRegionClicked);
      wsRegions.un("region-out", handleRegionOut);
      wavesurfer.un("interaction", handleInteraction);
    };
  }, [wavesurfer]);

  return wsRegionsRef;
};
