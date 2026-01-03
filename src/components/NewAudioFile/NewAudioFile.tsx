import { useEffect, useRef, useState } from "react"

import AudioControls from "../AudioControls/AudioControls"


function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function AudioPlayer({ file }: { file: File }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false)

  const [objectUrl, setObjectUrl] = useState<string>("")
  const [isReady, setIsReady] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)

  // Create / revoke object URL
  useEffect(() => {
    const url = URL.createObjectURL(file)
    setObjectUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  // Wire audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onAudioLoaded = () => {
      setAudioLoaded(true)
    }

    const onLoadedMetadata = () => {
      setIsReady(true)
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
      setCurrentTime(0)
    };

    const onTimeUpdate = () => {
      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0)
    }

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    const onEnded = () => {
      setIsPlaying(false)
      setCurrentTime(Number.isFinite(audio.duration) ? audio.duration : 0)
    }

    audio.addEventListener("loadeddata", onAudioLoaded)

    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("play", onPlay)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("loadeddata", onAudioLoaded)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("play", onPlay)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("ended", onEnded)
    }
  }, [])

  const togglePlay = async (): Promise<void> => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (audio.paused) {
        await audio.play()
      } else {
        audio.pause()
      }
    } catch {
      // autoplay or decode error
    }
  };

  const onSeek = (value: number): void => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = value
    setCurrentTime(value)
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <audio ref={audioRef} src={objectUrl} preload="metadata" />
      {file.name}
      <AudioControls audioRef={audioRef} audioLoaded={audioLoaded} />
      {/* <AudioControls isPlaying={isPlaying} onClick={togglePlay} /> */}

      {/* <button onClick={togglePlay} disabled={!isReady}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.01}
        value={Math.min(currentTime, duration || 0)}
        onChange={(e) => onSeek(Number(e.target.value))}
        disabled={!isReady}
        style={{ width: 240 }}
      />

      <div style={{ minWidth: 90, fontVariantNumeric: "tabular-nums" }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div> */}
    </div>
  )
}