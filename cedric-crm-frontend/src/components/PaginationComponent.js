// Import the React module to enable JSX and component functionality.
import React from 'react';

// Define a functional component named PaginationComponent.
function PaginationComponent({ currentPage, totalPages, onPageChange }) {
    // This component returns a JSX block that provides pagination controls.
    return (
        // A container div to wrap the pagination elements.
        <
        div className = "pagination-container" > {
            /* // A button to navigate to the previous page.
                        // The button is disabled if the current page is 1 or less. */
        } <
        button disabled = { currentPage <= 1 }
        // When the button is clicked, the onPageChange function is called with the previous page number.
        onClick = {
            () => onPageChange(currentPage - 1) } >
        Previous <
        /button>

        { /* // A span element displaying the current page and total pages, e.g., "Page 1 of 10". */ } <
        span > Page { currentPage }
        of { totalPages } < /span>

        {
            /* // A button to navigate to the next page.
                        // The button is disabled if the current page is equal to or greater than the total pages. */
        } <
        button disabled = { currentPage >= totalPages }
        // When the button is clicked, the onPageChange function is called with the next page number.
        onClick = {
            () => onPageChange(currentPage + 1) } >
        Next <
        /button> <
        /div>
    );
}

// Export the PaginationComponent for use in other parts of the application.
export default PaginationComponent;