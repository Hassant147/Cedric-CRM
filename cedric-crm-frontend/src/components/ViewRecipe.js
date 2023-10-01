// Importing required modules from React and React Router DOM libraries.
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// Importing Axios library for making HTTP requests.
import axios from 'axios';

// Define a utility function named formatDateSafely to format date strings safely.
const formatDateSafely = (dateString) => {
    // Check if dateString is null or undefined. If so, return "N/A".
    if (!dateString) return "N/A";
    try {
        // Try to convert the date string into a Date object.
        const date = new Date(dateString);
        // Extract and format the year, month, and day from the Date object.
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        // Return the formatted date string.
        return `${year}-${month}-${day}`;
    } catch (error) {
        // Log any errors encountered during date formatting.
        console.error("Error formatting date:", error.message);
        // Return "Invalid Date" if an error occurs.
        return "Invalid Date";
    }
};

// Define a functional React component named ViewRecipe.
function ViewRecipe() {
    // Declare state variables for storing the recipe details and any error messages.
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);
    // Use useParams to get the recipe ID from the URL.
    const { id } = useParams();

    // Use the useEffect hook to fetch the recipe details when the component mounts.
    useEffect(() => {
        // Define an async function to fetch recipe details.
        async function fetchRecipe() {
            try {
                // Make an HTTP GET request to fetch the recipe details.
                const response = await axios.get(`http://localhost:5001/api/recipes/${id}`);
                // Update the recipe state with the fetched data.
                setRecipe(response.data);
            } catch (error) {
                // Log the error message if fetching fails.
                console.error("There was a problem fetching the recipe:", error.message);
                // Update the error state to show a failure message.
                setError("Failed to fetch the recipe. Please try again later.");
            }
        }
        // Invoke the fetchRecipe function.
        fetchRecipe();
    }, [id]);  // The useEffect depends on the 'id' variable.

    // Check for errors and display them if present.
    if (error) return <div className="text-red-500">{error}</div>;
    // Display a loading message while waiting for the API response.
    if (!recipe) return <div>Loading...</div>;

    // Render the main component.
    return (
        // Main container for the component.
        <div className="min-h-screen bg-gray-100 p-5">
            {/* // Inner container for the component content. */}
            <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">
                {/* // Display the recipe name in English and Swedish. */}
                <h2 className="text-2xl mb-4 border-b pb-2">{recipe.name_en}/{recipe.name_sv}</h2>
                {/* // Grid layout for displaying recipe details. */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* // Display various details about the recipe. */}
                    {/* // Each detail is wrapped in a <p> tag with a label and value. */}
                    <p><span className="font-semibold">ID:</span> {recipe.id}</p>
                    <p><span className="font-semibold">Minutes:</span> {recipe.minutes}</p>
                    <p><span className="font-semibold">Contributor ID:</span> {recipe.contributor_id}</p>
                    <p><span className="font-semibold">Submitted:</span> {recipe.submitted}</p>
                    <p><span className="font-semibold">Tags (EN):</span> {recipe.tags_en}</p>
                    <p><span className="font-semibold">Tags (SV):</span> {recipe.tags_sv}</p>
                    <p><span className="font-semibold">Nutrition:</span> {recipe.nutrition}</p>
                    <p><span className="font-semibold">Total Calories:</span> {recipe.total_calories}</p>
                    <p><span className="font-semibold">Number of Steps:</span> {recipe.n_steps}</p>
                    <p><span className="font-semibold">Steps (EN):</span> {recipe.steps_en}</p>
                    <p><span className="font-semibold">Steps (SV):</span> {recipe.steps_sv}</p>
                    <p><span className="font-semibold">Description (EN):</span> {recipe.description_en}</p>
                    <p><span className="font-semibold">Description (SV):</span> {recipe.description_sv}</p>
                    <p><span className="font-semibold">Ingredients (EN):</span> {recipe.ingredients_en}</p>
                    <p><span className="font-semibold">Ingredients (SV):</span> {recipe.ingredients_sv}</p>
                    <p><span className="font-semibold">Number of Ingredients:</span> {recipe.n_ingredients}</p>
                    {/* // Display the recipe thumbnail image if available. */}
                    <p><span className="font-semibold">Thumbnail:</span> <img className="mt-2 rounded shadow-md" src={recipe.thumbnail_path || recipe.thumbnail} alt="Recipe Thumbnail" width="100" /></p>
                    {/* // Indicate if the image is a default image or not. */}
                    <p><span className="font-semibold">Defaulted Image:</span> {recipe.defaulted_image ? "Yes" : "No"}</p>
                    {/* // Display the date the recipe was created and modified. */}
                    <p><span className="font-semibold">Date Created:</span> {formatDateSafely(recipe.created_at)}</p>
                    <p><span className="font-semibold">Date Modified:</span> {formatDateSafely(recipe.updated_at)}</p>
                    {/* // Display the date the recipe was deleted, if applicable. */}
                    <p><span className="font-semibold">Date Deleted:</span> {formatDateSafely(recipe.deleted_at)}</p>
                    {/* // Display the food preference associated with the recipe. */}
                    <p><span className="font-semibold">Food Preference:</span> {recipe.foodpreference}</p>
                </div>
                {/* // Action buttons to navigate back to the recipe list or to edit the current recipe. */}
                <div className="mt-8 flex space-x-4">
                    <Link to="/recipes" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Back to Recipes List</Link>
                    <Link to={`/edit-recipe/${recipe.id}`} className="mr-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edit Recipe</Link>
                </div>
            </div>
        </div>
    );
}

// Export the ViewRecipe component so that it can be used in other parts of the application.
export default ViewRecipe;
