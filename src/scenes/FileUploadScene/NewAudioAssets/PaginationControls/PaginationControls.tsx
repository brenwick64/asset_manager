import './PaginationControls.css'
import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { PaginationControllerType } from '../../../../hooks/usePaginateAssets'
import PageCountBlips from './PageCountBlips/PageCountBlips'

function PaginationControls({ controller } : { controller: PaginationControllerType }) {
  const [currentPage, setCurrentPage] = useState<number>(1)  

  const handlePageLeft = (): void => {
    if(controller.isLeftBoundary) return 
    controller.previousPage()
    setCurrentPage(currentPage => currentPage - 1)
  }
    const handlePageRight = (): void => {
    if(controller.isRightBoundary) return 
    controller.nextPage()
    setCurrentPage(currentPage => currentPage + 1)
  }

  return (
    <div className='pagination-controls'>
      <button 
        className='button-reset'
        onClick={handlePageLeft}
      >
        <FaChevronLeft/>
      </button>
      <PageCountBlips currentPage={currentPage} totalPages={controller.numPages} />
      <button 
        className='button-reset'
        onClick={handlePageRight}
      >
        <FaChevronRight />
      </button>
    </div>
  )
}

export default PaginationControls