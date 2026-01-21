import './AudioControls.css'
import PlayBtn from './PlayBtn/PlayBtn'
import AudioSlider from './AudioSlider/AudioSlider'
import AudioDuration from './AudioDuration/AudioDuration'


function AudioControls({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement> }) {
	return <div className="audio-controls">
				<PlayBtn audioRef={audioRef} />
				<AudioSlider audioRef={audioRef} />
				<AudioDuration audioRef={audioRef} />
			</div>
	
}

export default AudioControls
  