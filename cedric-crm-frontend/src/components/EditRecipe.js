// Importing necessary modules and components from React and react-router-dom
import React, { useState, useEffect } from 'react';
import RecipeForm from './RecipeForm';
import { useParams } from 'react-router-dom';

// Define the EditRecipe functional component
function EditRecipe() {
    // Using the useParams hook to retrieve the recipe ID from the URL parameters
    const { id } = useParams();
    // useState hook to manage the recipe data
    const [recipe, setRecipe] = useState(null);

    // useEffect hook to fetch the specific recipe data when the component mounts or the ID changes
    useEffect(() => {
        // Asynchronous function to fetch the specific recipe from the backend
        const fetchRecipe = async() => {
            try {
                // Make a GET request to fetch the recipe data based on its ID
                const response = await fetch(`http://localhost:5100/api/recipes/${id}`);
                const data = await response.json();
                // Update the recipe state with the fetched data
                setRecipe(data);
            } catch (error) {
                // Log any errors encountered during fetching
                console.error("Error fetching the recipe:", error);
            }
        };

        // Call the fetchRecipe function
        fetchRecipe();
    }, [id]); // Dependency array for useEffect, ensuring the effect runs again if the 'id' changes

    // Render the component
    return ( <
        div className = "edit-recipe-container" > {
            /* 
                            Conditional rendering:
                            If the recipe data is loaded, render the RecipeForm component in edit mode,
                            Otherwise, display a loading message.
                        */
        } { recipe ? < RecipeForm recipe = { recipe }
            isEditing = { true }
            /> : <p>Loading...</p > } <
        /div>
    );
}

// Exporting the EditRecipe component for use in other parts of the application
export default EditRecipe;