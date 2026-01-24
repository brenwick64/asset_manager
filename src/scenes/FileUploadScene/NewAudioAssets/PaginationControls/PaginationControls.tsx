import './PaginationControls.css'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { PaginationControllerType } from '../../../../hooks/usePaginateAssets'
import PageCountBlips from './PageCountBlips/PageCountBlips'

function PaginationControls({ controller } : { controller: PaginationControllerType }) {  
  
  const handlePageLeft = (): void => {
    controller.previousPage()
  }
  
  const handlePageRight = (): void => {
      controller.nextPage()
  }

  return (
    <div className='pagination-controls'>
      <button 
        className={controller.isLeftBoundary ? 'pagination-btn pagination-btn-disabled' : 'pagination-btn'}
        onClick={handlePageLeft}
        disabled={controller.isLeftBoundary}
      >
        <FaChevronLeft size={24} />
      </button>
      <PageCountBlips currentPage={controller.currentPage} totalPages={controller.totalPages} setPageNumber={controller.setPageNumber} />
      <button 
        className={controller.isRightBoundary ? 'pagination-btn pagination-btn-disabled' : 'pagination-btn'}
        onClick={handlePageRight}
        disabled={controller.isRightBoundary}
      >
        <FaChevronRight size={24} />
      </button>
    </div>
  )
}

export default PaginationControls