import './NewAudioFiles.css'
import NewAudioFile from '../NewAudioFile/NewAudioFile'

function NewAudioFiles({ files }: { files: File[] }) {
  return (
    <div className='new-audio-files'>
      {files.map((file) => (
        <NewAudioFile key={file.name} file={file} />
      ))}
    </div>
  )
}

export default NewAudioFiles