import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

    if (totalPages <= 1) {
        return null
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }
    }

    const getPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = 5
        const halfPages = Math.floor(maxPagesToShow / 2)

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let startPage = Math.max(1, currentPage - halfPages);
            let endPage = Math.min(totalPages, currentPage + halfPages);

            if (currentPage - halfPages <= 1) {
                endPage = maxPagesToShow;
            }

            if (currentPage + halfPages >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
            }

            if (startPage > 1) {
                pageNumbers.push(1);
                if (startPage > 2) {
                    pageNumbers.push('...');
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbers.push('...')
                }
                pageNumbers.push(totalPages)
            }
        }

        return pageNumbers
    }

    const pageNumbers = getPageNumbers()

    return (
        <nav className="flex items-center justify-between" aria-label="Pagination">
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={16} className="mr-2" />
                Previous
            </button>

            <div className="hidden sm:flex items-center gap-2">
                {pageNumbers.map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={typeof page !== 'number'}
                        className={clsx(
                            "flex items-center justify-center px-3 h-8 text-sm leading-tight border rounded-md",
                            {
                                'bg-[#545F71] text-white border-[#545F71]': currentPage === page,
                                'bg-white text-gray-500 border-gray-300 hover:bg-gray-100 hover:text-gray-700': currentPage !== page && typeof page === 'number',
                                'text-gray-500 bg-white border-gray-300 cursor-default': typeof page !== 'number',
                            }
                        )}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Next
                <ChevronRight size={16} className="ml-2" />
            </button>
        </nav>
    )
}

export default Pagination