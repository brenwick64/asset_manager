import './SaveAssetsBtn.css'

type Props = {
    onSaveAssets: () => void
}

function SaveAssetsBtn({ onSaveAssets }: Props) {
  return (
    <div>
        <button onClick={onSaveAssets}>DEBUG: SAVE</button>
    </div>
  )
}

export default SaveAssetsBtn