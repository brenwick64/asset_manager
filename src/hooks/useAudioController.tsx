import { useState } from "react"

export function useAudioController(audioRef: React.RefObject<HTMLAudioElement>) {
    // State
    const [elapsedSec, setElapsedSec] = useState<number>(0)
    // Constants
    const audio = audioRef.current
    if (!audio) return null

    const totalDurationSecs = audio.duration


    // Events
    audio.addEventListener('timeupdate', () => { onTimeUpdate()})
    audio.addEventListener('ended', () => { })

    // Computed
    const elapsedMs = Math.floor(elapsedSec * 1000)
    
    // Event Handlers
    const onTimeUpdate = () => {
        setElapsedSec(audio.currentTime)
    }
    const onAudioEnded = () => {
        setElapsedSec(0)
    }


    // Methods
    const play = () => {
        const audio = audioRef.current
        if (!audio) return
        audio.play()
    }

    const pause = () => {}
    const stop = () => {}

    // Setters/Getters

    

    // Returns
    return {
        play,
        pause,
        stop,
        elapsedSec,
        totalDurationSecs
    }
}