import React, { useState } from "react";

const AudioUploader = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const onSubmit = () => {
    // setIsLoading(true)
    // setError(null)
    console.log(audioFile);
  };

  return (
    <div className="flex gap-4 flex-col">
      {/* Add allowed file types */}
      <p>Only .MP3, .FLAC, .WAV allowed</p>
      <input
        type="file"
        name="audio-file"
        onChange={onFileUpload}
        accept="audio/mp3, audio/flac, audio/wav"
        className="block"
      />
      <button
        type="submit"
        disabled={isLoading}
        onClick={onSubmit}
        className="rounded-sm bg-white text-black px-2 py-1 self-start"
      >
        Submit
      </button>
      {error && <p className="border border-red-500">Error: {error}</p>}
    </div>
  );
};

export default AudioUploader;
