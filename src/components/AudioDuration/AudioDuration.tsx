import './AudioDuration.css'

function AudioDuration({ elapsedSec, totalDurationSecs }: { elapsedSec: number, totalDurationSecs: number }) {

  return (
    <div className='audio-duration'>
        {elapsedSec}/{totalDurationSecs}
    </div>
  )
}

export default AudioDuration