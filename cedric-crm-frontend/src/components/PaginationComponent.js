// Import the React library to use its features
import React from 'react';

// Define the functional component called PaginationComponent
// It takes three props: currentPage, totalPages, and onPageChange
function PaginationComponent({ currentPage, totalPages, onPageChange }) {
    // Declare a constant called pagesToShow and set its value to 5.
    // This constant defines the number of pagination buttons visible around the current page.
    const pagesToShow = 5; 
    
    // Calculate the starting page number for pagination.
    // It will be the greater value between 1 and (currentPage - half of pagesToShow).
    // Math.floor() rounds down to the nearest integer.
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    
    // Calculate the ending page number for pagination.
    // It will be the smaller value between totalPages and (currentPage + half of pagesToShow).
    const endPage = Math.min(totalPages, currentPage + Math.floor(pagesToShow / 2));

    // Initialize an empty array called pageNumbers.
    // This will hold the page numbers that should be displayed.
    const pageNumbers = [];
    
    // Loop through the range of pages from startPage to endPage.
    // Populate the pageNumbers array with these values.
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    // The JSX that this component will render
    return (
        // Create a div container for the pagination buttons.
        // Apply various CSS classes for styling.
        <div className="pagination-container flex justify-center items-center space-x-4 my-4">
            
            {/* // Create a "First" button to navigate to the first page.
            // Disable the button if the current page is 1 or less.
            // Call the onPageChange function with argument 1 when clicked. */}
            <button 
                disabled={currentPage <= 1} 
                onClick={() => onPageChange(1)}
                className={`px-3 py-2 rounded ${currentPage <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
                First
            </button>
            
            {/* // Create a "Previous" button to navigate to the previous page.
            // Disable the button if the current page is 1 or less.
            // Call the onPageChange function with argument (currentPage - 1) when clicked. */}
            <button 
                disabled={currentPage <= 1} 
                onClick={() => onPageChange(currentPage - 1)}
                className={`px-3 py-2 rounded ${currentPage <= 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
                Previous
            </button>
            
            {/* // Display ellipsis if there are pages before the startPage. */}
            {startPage > 1 && <span className="px-3 py-2">...</span>}
            
            {/* // Loop through the pageNumbers array to create page number buttons. */}
            {pageNumbers.map(number => (
                // Create a button for each page number.
                // Highlight the button if it's the current page.
                // Call the onPageChange function with the page number as the argument when clicked.
                <button 
                    key={number}
                    className={`px-3 py-2 rounded ${number === currentPage ? 'bg-blue-700 text-white' : 'hover:bg-blue-500 hover:text-white'}`}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}
            
            {/* // Display ellipsis if there are pages after the endPage. */}
            {endPage < totalPages && <span className="px-3 py-2">...</span>}
            
            {/* // Create a "Next" button to navigate to the next page.
            // Disable the button if the current page is the last page or greater.
            // Call the onPageChange function with argument (currentPage + 1) when clicked. */}
            <button 
                disabled={currentPage >= totalPages} 
                onClick={() => onPageChange(currentPage + 1)}
                className={`px-3 py-2 rounded ${currentPage >= totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
                Next
            </button>
            
            {/* // Create a "Last" button to navigate to the last page.
            // Disable the button if the current page is the last page or greater.
            // Call the onPageChange function with argument totalPages when clicked. */}
            <button 
                disabled={currentPage >= totalPages} 
                onClick={() => onPageChange(totalPages)}
                className={`px-3 py-2 rounded ${currentPage >= totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
                Last
            </button>
        </div>
    );
}

// Export the PaginationComponent so it can be used in other parts of the application
export default PaginationComponent;
