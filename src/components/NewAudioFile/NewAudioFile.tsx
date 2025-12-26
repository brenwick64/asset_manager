import './NewAudioFile.css'

import AudioPlayBtn from '../AudioPlayBtn/AudioPlayBtn'

function NewAudioFile({ file }: { file: File }) {
  return (
    <div className="new-audio-file">
        <AudioPlayBtn fileName={file.name} filePath={URL.createObjectURL(file)} />
        {file.name}
        {file.path}
    </div>
  )
}

export default NewAudioFile