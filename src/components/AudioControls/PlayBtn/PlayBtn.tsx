import './PlayBtn.css'
import { useState, useEffect } from 'react';
import { FaPlay, FaPause } from "react-icons/fa";


function PlayBtn({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement> }) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const togglePlay = (): void => {
    const audio = audioRef.current
    if (!audio) return

    isPlaying ? audio.pause() : audio.play()
  }


  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [audioRef])


  return (
    <>
        <button 
            className='play-btn' 
            onClick={togglePlay}>
                {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
    </>
  )
}

export default PlayBtn