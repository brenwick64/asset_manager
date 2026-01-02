import React, { useEffect, useState } from "react"
import "./AudioSlider.css"

function AudioSlider({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement> }) {
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0)
  const [durationSec, setDurationSec] = useState<number>(0)

  const onSeek = (value: number): void => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTimeSec(value)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const syncDuration = () => {
      const d = Number.isFinite(audio.duration) ? audio.duration : 0
      setDurationSec(d)
    }

    const handleTimeUpdate = () => {
      if (durationSec < 1) return
      setCurrentTimeSec(audio.currentTime)
    }

    const handleEnded = () => {
      if (durationSec < 1) return
      setCurrentTimeSec(Number.isFinite(audio.duration) ? audio.duration : 0)
    }

    syncDuration()

    audio.addEventListener("loadedmetadata", syncDuration)
    audio.addEventListener("durationchange", syncDuration)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", syncDuration)
      audio.removeEventListener("durationchange", syncDuration)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioRef, durationSec])

  return (
    <input
      type="range"
      min={0}
      max={durationSec}
      step={0.1}
      value={Math.min(currentTimeSec, durationSec)}
      onChange={(e) => onSeek(Number(e.target.value))}
      disabled={durationSec < 1}
    />
  )
}

export default AudioSlider
