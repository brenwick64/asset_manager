import React, { useEffect } from 'react'

function AudioDuration({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement> }) {
  const durationSec: number = audioRef.current?.duration || 0

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    }, [audioRef])

  return (
    <div className='audio-duration'>
        {durationSec.toFixed(2)} seconds
    </div>
  )
}

export default AudioDuration