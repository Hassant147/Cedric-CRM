// Import the React library to use its features
import React from 'react';

// Import the Link component from the react-router-dom library to enable navigation
import { Link } from 'react-router-dom';

// Define a functional component called Breadcrumb
// It takes a single prop called crumbs, which is an array of breadcrumb items
function Breadcrumb({ crumbs }) {
    
    // Render the JSX for the breadcrumb
    return (
        // Create a div container with a background color and padding to hold the breadcrumb items
        <div className="bg-gray-100 p-4 mb-4">
            
            {/* // Loop through the crumbs array and create breadcrumb items
            // crumb is the current item, and index is its position in the array */}
            {crumbs.map((crumb, index) => (
                
                // Use a span element to wrap each breadcrumb item
                // The key prop is set to index, which is unique for each item in the array
                <span key={index}>
                    
                    {/* // Check if the current breadcrumb item is not the first one */}
                    {/* // If it's not the first, add a greater-than symbol to separate it from the previous item */}
                    {index !== 0 && ' > '}
                    
                    {/* // Create a Link component for navigation
                    // The 'to' prop is set to crumb.path, which is the navigation path for the breadcrumb item
                    // The text for the breadcrumb item is set to crumb.label
                    // Add CSS classes for styling and hover effects */}
                    <Link to={crumb.path} className="text-blue-500 hover:underline">
                        {crumb.label}
                    </Link>
                    
                </span>
                
            ))}
            
        </div>
    );
}

// Export the Breadcrumb component so that it can be used in other parts of the application
export default Breadcrumb;
