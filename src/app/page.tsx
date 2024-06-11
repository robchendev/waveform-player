"use client";

import AudioUploader from "@/components/AudioUploader";
import AudioPlayer from "@/components/AudioPlayer";
import { useState } from "react";

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-slate-800 [&>div]:w-full">
      <AudioUploader setAudioFile={setAudioFile} />
      {audioFile && <AudioPlayer audioSrc={URL.createObjectURL(audioFile)} />}
    </main>
  );
}
