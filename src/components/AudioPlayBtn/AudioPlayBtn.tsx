import './AudioPlayBtn.css'

function AudioPlayBtn({ fileName, filePath } : { fileName: string, filePath: string }) {

    const playAudio = () => {
        const audioElement = document.getElementById(fileName) as HTMLAudioElement
        if (audioElement) {
            audioElement.play()
        }
    }


  return (
    <div className="audio-play-btn">
        <audio id={fileName} src={filePath}></audio>
        <button onClick={playAudio}>Play</button>
    </div>
  )
}

export default AudioPlayBtn