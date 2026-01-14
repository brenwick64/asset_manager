/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react"
import { range } from "../utils/arrayUtils"

export type PaginationControllerType = {
    previousPage: () => void
    nextPage: () => void
    setPageNumber: (num: number) => void
    resetPage: () => void
    currentPage: number
    totalPages: number
    isLeftBoundary: boolean,
    isRightBoundary: boolean,
    visibleIndexes: number[]
}

export const usePaginateAssets = (data: any, maxRowsPerPage: number)=> {
    const [currentPage, setCurrentPage] = useState(1)

    // State to pass to Components
    const totalPages: number = Math.ceil(data.length / maxRowsPerPage)
    const isLeftBoundary: boolean = currentPage === 1
    const isRightBoundary: boolean = currentPage === totalPages

    const visibleIndexes: number[] = useMemo(() => {
        const start: number = (currentPage - 1) * maxRowsPerPage
        const end: number = Math.min(start + maxRowsPerPage - 1, data.length - 1)
        if (data.length === 0 || end < start) return []
        return range(start, end)
    }, [currentPage, maxRowsPerPage, data.length])


    // State Mutators
    const nextPage = (): void => {
        setCurrentPage((currentPage) => Math.min(currentPage + 1, totalPages))
    }

    const previousPage = (): void => {
        setCurrentPage((currentPage) => Math.max(currentPage - 1, 1))
    }

    const setPageNumber = (num: number): void => {
        setCurrentPage(num)
    }

    const resetPage = (): void => {
        setCurrentPage(1)
    }

    return { paginationController:  { previousPage, nextPage, setPageNumber, resetPage, currentPage, totalPages, isLeftBoundary, isRightBoundary, visibleIndexes } }
}