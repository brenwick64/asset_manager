import './SaveAssetsBtn.css'
import { MdFileUpload } from "react-icons/md";


type Props = {
    assets: NewAudioAsset[]
    onSaveAssets: () => void
}

function SaveAssetsBtn({ assets, onSaveAssets }: Props) {  
  const assetChecked: boolean = assets.filter((asset: NewAudioAsset) => { return asset.is_checked === true }).length > 0
  
  return (
    <button 
      className={assetChecked ? 'save-assets-btn' : 'save-assets-btn save-assets-btn-inactive'} 
      onClick={onSaveAssets}
    >
      <span><MdFileUpload size={20} /></span>
      <span>Save & Upload </span>
    </button>
  ) 
}

export default SaveAssetsBtn