import './TagsManager.css'
import { useState } from 'react'
import { IoMdAdd } from "react-icons/io";
import { LuTags } from "react-icons/lu";
import Tag from './Tag/Tag'

type Props = {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  onTagsUpdated: (tags: string[]) => Promise<Result<unknown>>
}

function TagsManager({ tags, setTags, onTagsUpdated }: Props) {
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
    if(!input) return
    if(tagName.trim() === "") return
    
    setTags((prev: string[]) => {
      const next: string[] = [...prev, tagName]
      void onTagsUpdated(next)
      return next
    })
    setInput("")
  }

  const removeTag = (tagName: string): void => {
    setTags((prev: string[]) => {
      const next: string[] = prev.filter((tag: string) => { return tag !== tagName })
      void onTagsUpdated(next)
      return next
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
        <div className='tag-input-icon'>
          <LuTags size={16} />
        </div>
        <input className='tag-input' placeholder='Add Tag' value={input} onChange={(e) => onInput(e)} onKeyDown={(e) => onKeyDown(e)} ></input>
        <button className='add-tag-btn' onClick={() => addTag(input)} >
          <IoMdAdd size={20}/>
        </button>
      </div>
    </div>
  )
}

export default TagsManager