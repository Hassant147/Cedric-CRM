// Importing necessary modules and styles
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css';

// RecipeCategoryComponent function component
function RecipeCategoryComponent() {
    // Using the useParams hook to get the preference from the URL parameters
    const { preference } = useParams();

    // Using the useNavigate hook to get the navigate function for navigation
    const navigate = useNavigate();

    // Predefined list of recipe categories
    const categories = ['Pasta', 'Boiled Rice', 'Salad', 'Soup', 'Dessert'];

    // Function to handle the click event on category buttons
    const handleCategoryClick = (category) => {
        // Navigating to the route with the selected preference and category
        navigate(`/preferences/${preference}/${category}`);
    }

    return (
        // Container for the recipe categories
        <
        div className = "recipe-category-container common-container" > { /* Heading displaying the chosen food preference */ } <
        h2 className = "common-heading" > Select Recipe Category
        for { preference } < /h2>

        { /* Group of buttons for different recipe categories */ } <
        div className = "categories btn-group" > { /* Mapping over the categories array to render a button for each category */ } {
            categories.map(category => ( <
                button key = { category }
                className = "btn"
                onClick = {
                    () => handleCategoryClick(category) } > { category } <
                /button>
            ))
        } <
        /div>

        { /* Button to navigate back to the previous page */ } <
        div className = "mt-6" >
        <
        button className = "btn"
        onClick = {
            () => navigate(-1) } > Back < /button> <
        /div> <
        /div>
    );
}

// Exporting the RecipeCategoryComponent for use in other parts of the application
export default RecipeCategoryComponent;