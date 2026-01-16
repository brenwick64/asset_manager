import './TagsManager.css'
import { useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import Tag from './Tag/Tag'

type Props = {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
}

function TagsManager({ tags, setTags }: Props) {
  const [input, setInput] = useState<string>("")

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    }
  }

  const addTag = (tagName: string): void => {
    if(!input){ return }
    setTags(prev => [...prev, tagName])
    setInput("")
  }

  const removeTag = (tagName: string): void => {
    setTags(prev => {
      return prev.filter((tag: string) => { return tag !== tagName })
    })
  }

  return (
    <div className='tags-manager'>
      <div className='tags'>
        {tags.map((tag: string) => {
          return <Tag key={tag} tagName={tag} removeTag={removeTag} />
        })}
      </div>
      <div className='tag-input-container'>
        <input className='tag-input' value={input} onChange={(e) => onInput(e)} onKeyDown={(e) => onKeyDown(e)} ></input>
        <button className='add-tag-btn' onClick={() => addTag(input)} >
          <IoMdAdd size={20}/>
        </button>
      </div>
    </div>
  )
}

export default TagsManager