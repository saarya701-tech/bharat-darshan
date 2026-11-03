'use client';

import { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(22);
  const [showVolume, setShowVolume] = useState(false);

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    audio.volume = volume / 100;
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  function changeVolume(value: number) {
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value / 100;
    if (value === 0 && playing) {
      audioRef.current?.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="audio-control">
      <audio
        ref={audioRef}
        src="/audio/ambient-heritage.wav"
        loop
        preload="none"
        onEnded={() => setPlaying(false)}
      />
      <button
        className="icon-button"
        onClick={toggleAudio}
        aria-label={playing ? "Pause ambient music" : "Play ambient music"}
        title={playing ? "Pause ambient music" : "Play ambient music"}
      >
        {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      <button
        className="audio-label"
        onClick={() => setShowVolume((value) => !value)}
        aria-expanded={showVolume}
      >
        {playing ? "SOUND ON" : "SOUND OFF"}
      </button>
      {showVolume && (
        <label className="volume-popover">
          <span>AMBIENCE</span>
          <input
            aria-label="Ambient audio volume"
            type="range"
            min="0"
            max="60"
            value={volume}
            onChange={(event) => changeVolume(Number(event.target.value))}
          />
          <span>{volume}%</span>
        </label>
      )}
    </div>
  );
}
