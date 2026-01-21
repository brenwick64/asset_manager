import './Tag.css'
import { FaXmark } from "react-icons/fa6"

type Props = {
  tagName: string
  removeTag: (tagName: string) => void
}

function Tag({ tagName, removeTag }: Props) {

  return (
    <div className='tag'>
      <div 
        className='tag-exit-btn'
        onClick={() => removeTag(tagName)}
      >
        <FaXmark size={12} />
      </div>
        {tagName}
    </div>
  )
}

export default Tag