// Importing required modules from React and React Router DOM libraries.
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
// Importing Axios library for making HTTP requests.
import axios from 'axios';
// Importing the RecipeForm component, which will be used to render the recipe form.
import RecipeForm from './RecipeForm';

// Define a functional React component named UpdateRecipe.
function UpdateRecipe() {
    // Use the useParams hook to extract the 'recipeId' from the URL.
    const { recipeId } = useParams();
    // Use the useLocation hook to get the current location object, which might contain the initial recipe data.
    const location = useLocation();
    // Extract the initial recipe data from the location state if available.
    const initialRecipeData = location.state?.recipe;

    // Declare state variables for storing the recipe details, any error messages, and any success messages.
    const [recipe, setRecipe] = useState(initialRecipeData);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Use the useEffect hook to fetch the recipe details if not available from the navigation state.
    useEffect(() => {
        // Check if the recipe data is not available.
        if (!recipe) {
            // Define an async function to fetch recipe details.
            const fetchRecipeDetails = async () => {
                try {
                    // Make an HTTP GET request to fetch the recipe details by ID.
                    const response = await axios.get(`http://localhost:5001/api/recipes/${recipeId}`);
                    // Update the recipe state with the fetched data.
                    setRecipe(response.data);
                } catch (err) {
                    // Log any errors that occur during the fetch operation.
                    console.error("Error fetching recipe details:", err);
                    // Update the error state to display an error message.
                    setError('Failed to fetch the recipe details. Please try again later.');
                }
            };

            // Call the fetchRecipeDetails function to initiate the API call.
            fetchRecipeDetails();
        }
    }, [recipeId, recipe]);  // The useEffect depends on 'recipeId' and 'recipe'.

    // Define an async function named handleUpdate to handle recipe updates.
    const handleUpdate = async (updatedRecipe) => {
        try {
            // Make an HTTP PUT request to update the recipe data.
            await axios.put(`http://localhost:5001/api/recipes/${recipeId}`, updatedRecipe);
            // Update the success state to display a success message.
            setSuccess('Recipe updated successfully!');
        } catch (err) {
            // Log any errors that occur during the update operation.
            console.error("Error updating recipe:", err);
            // Update the error state to display an error message.
            setError('Failed to update the recipe. Please try again later.');
        }
    };

    // Render the main component.
    return (
        // Main container div.
        <div>
            {/* // Render a heading to indicate that this is the Update Recipe page. */}
            <h2>Update Recipe</h2>
            {/* // Check for error state and display error message in red if present. */}
            {error && <div style={{color: 'red'}}>{error}</div>}
            {/* // Check for success state and display success message in green if present. */}
            {success && <div style={{color: 'green'}}>{success}</div>}
            {/* // Render the RecipeForm component, passing initial data and the onSubmit handler. */}
            {recipe && <RecipeForm initialData={recipe} onSubmit={handleUpdate} />}
        </div>
    );
}

// Export the UpdateRecipe component so it can be used elsewhere in the application.
export default UpdateRecipe;
