/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react"

export type PaginationControllerType = {
    previousPage: () => void
    nextPage: () => void
    resetPage: () => void
    page: number
    numPages: number
    isLeftBoundary: boolean,
    isRightBoundary: boolean
}

export const usePaginateAssets = (data: any, maxRowsPerPage: number)=> {
    const [page, setPage] = useState(1)

    // State to pass to Components
    const numPages = Math.ceil(data.length / maxRowsPerPage)
    const isLeftBoundary = page === 1
    const isRightBoundary = page === numPages

    // State Mutators
    const nextPage = () => {
        setPage((currentPage) => Math.min(currentPage + 1, numPages))
    }

    const previousPage = () => {
        setPage((currentPage) => Math.max(currentPage - 1, 1))
    }

    const resetPage = () => {
        setPage(1)
    }

    const paginationData = data.slice((page - 1) * maxRowsPerPage, page * maxRowsPerPage)

    return { paginationData: paginationData, paginationController:  { previousPage, nextPage, resetPage, page, numPages, isLeftBoundary, isRightBoundary } }
}