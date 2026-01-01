import './AudioPlayBtn.css'

function AudioPlayBtn({ playAudio } : { playAudio: () => void }) {

  return (
    <div className='audio-controls'>
      <div className="audio-play-btn">
          <button onClick={playAudio}>Play</button>
      </div>
    </div>
  )
}

export default AudioPlayBtn