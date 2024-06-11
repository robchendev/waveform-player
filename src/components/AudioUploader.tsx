import React, { useState } from "react";

interface AudioUploaderProps {
  setAudioFile: (file: File) => void;
}

const AudioUploader = ({ setAudioFile }: AudioUploaderProps) => {
  const [error, setError] = useState<string | null>(null);

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      setError("No files uploaded");
      return;
    }
    if (e.target.files.length > 1) {
      setError("Only 1 file upload allowed");
      return;
    }
    setAudioFile(e.target.files[0]);
  };

  return (
    <div className="flex gap-4 flex-col">
      <p>Only .MP3, .FLAC, .WAV allowed</p>
      <input
        type="file"
        name="audio-file"
        onChange={onFileUpload}
        accept="audio/mp3, audio/flac, audio/wav"
        className="block"
      />
      {error && <p className="border border-red-500 self-start">Error: {error}</p>}
    </div>
  );
};

export default AudioUploader;
