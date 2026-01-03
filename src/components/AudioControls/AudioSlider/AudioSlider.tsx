import "./AudioSlider.css"
import { MIN_AUDIO_DURATION_SEC } from '../../../globals/constants'
import React, { useEffect, useState } from "react"

type Props = {
  audioRef: React.RefObject<HTMLAudioElement>
}

function AudioSlider({ audioRef }: Props) {
  const [durationSec, setDurationSec] = useState<number>(audioRef.current?.duration || 0)
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0)  


  const handleSeek = (value: number): void => {
        const audio = audioRef.current
        if (!audio) return
        audio.currentTime = value
  }


  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = (): void => {
      if (durationSec < 1) return
      setCurrentTimeSec(audio.currentTime)
    }

    const onDurationChange = (): void => {
      setDurationSec(Number.isFinite(audio.duration) ? audio.duration : 0)
    }

    const onEnded = (): void => {
      if (durationSec < 1) return
      setCurrentTimeSec(Number.isFinite(audio.duration) ? audio.duration : 0)
    }

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("durationchange", onDurationChange)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("durationchange", onDurationChange)
      audio.removeEventListener("ended", onEnded)
    }
  }, [audioRef, durationSec])


  return (
    <>
      <input
        type="range"
        min={0}
        max={durationSec}
        step={0.1}
        value={Math.min(currentTimeSec, durationSec)}
        onChange={(e) => handleSeek(Number(e.target.value))}
        disabled={durationSec < MIN_AUDIO_DURATION_SEC}
      />
    </>
  )
}

export default AudioSlider
