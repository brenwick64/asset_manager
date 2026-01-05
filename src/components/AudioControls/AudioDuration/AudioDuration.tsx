import './AudioDuration.css'
import { MIN_AUDIO_DURATION_SEC } from '../../../globals/constants'
import { useEffect, useState } from 'react'

type Props = {
	audioRef: React.RefObject<HTMLAudioElement>
}

function AudioDuration({ audioRef }: Props) {
  const [durationSec, setDurationSec] = useState<number>(audioRef.current?.duration || 0)

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return


    const onDurationChange = (): void => {
      setDurationSec(Number.isFinite(audio.duration) ? audio.duration : 0)
    }

		audio.addEventListener('durationchange', onDurationChange)

		return () => {
      audio.removeEventListener('durationchange', onDurationChange)
		}
	}, [audioRef])


	return (
		<div className="audio-duration">
      {durationSec < MIN_AUDIO_DURATION_SEC 
      ? 
        `< ${MIN_AUDIO_DURATION_SEC} sec` 
        : 
        `~ ${durationSec.toFixed(0)} sec`}
		</div>
	)
}

export default AudioDuration