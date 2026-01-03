import './AudioDuration.css'
import { MIN_AUDIO_DURATION_SEC } from '../../../globals/constants'
import { useEffect, useState } from 'react'

type Props = {
	audioRef: React.RefObject<HTMLAudioElement>
}

function AudioDuration({ audioRef }: Props) {
  const [durationSec, setDurationSec] = useState<number>(audioRef.current?.duration || 0)
	const [elapsedSec, setElapsedSec] = useState<number>(0)


	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		const onTimeUpdate = (): void => {
			setElapsedSec(Number.isFinite(audio.currentTime) ? audio.currentTime : 0)
		}

    const onDurationChange = (): void => {
      setDurationSec(Number.isFinite(audio.duration) ? audio.duration : 0)
    }

		audio.addEventListener('timeupdate', onTimeUpdate)
		audio.addEventListener('durationchange', onDurationChange)

		return () => {
			audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
		}
	}, [audioRef])


	return (
		<div className="audio-duration">
      {durationSec < MIN_AUDIO_DURATION_SEC 
      ? 
        `< ${MIN_AUDIO_DURATION_SEC} seconds` 
        : 
        `${elapsedSec.toFixed(0)} / ${durationSec.toFixed(0)} sec`}
		</div>
	)
}

export default AudioDuration