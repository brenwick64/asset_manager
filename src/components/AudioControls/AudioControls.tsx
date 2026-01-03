import './AudioControls.css'
import PlayBtn from './PlayBtn/PlayBtn'
import AudioSlider from './AudioSlider/AudioSlider'
import AudioDuration from './AudioDuration/AudioDuration'


function AudioControls({ audioRef, audioLoaded }: { audioRef: React.RefObject<HTMLAudioElement>, audioLoaded: boolean }) {

	const controls: JSX.Element = (
		<div className="audio-controls">
			<PlayBtn audioRef={audioRef} />
			<AudioSlider audioRef={audioRef} />
			<AudioDuration audioRef={audioRef} />
		</div>
	)

	const loading: JSX.Element = (
		<div className="audio-loading-overlay">Loading...</div>
	)

	return (audioLoaded && audioRef.current) ? controls : loading
}

export default AudioControls
  