import { BsUpload } from 'react-icons/bs'
import './FileDrop.css'

type Props = {
    dragged: boolean,
    handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void,
    handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void,
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void,
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void
}

function FileDrop({ dragged, handleDragEnter, handleDragLeave, handleDragOver, handleDrop }: Props) {
  return (
    <div 
      className={dragged ? 'scene file-upload-scene file-upload-scene-dragged' : 'scene file-upload-scene'}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragLeave={(e) => { handleDragLeave(e) }}
      onDragOver={(e) => handleDragOver(e)}
      onDrop={(e) => handleDrop(e)}
    >
      <BsUpload className='upload-icon' size={64} />
    </div>
  )
}

export default FileDrop