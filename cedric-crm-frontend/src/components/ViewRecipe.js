// Importing necessary modules and components
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shimmer } from 'react-shimmer';

// ViewRecipe function component
function ViewRecipe() {
    // useState hook to manage the recipe data
    const [recipe, setRecipe] = useState(null);
    // Using the useParams hook to get the recipe ID from the URL parameters
    const { id } = useParams();
    // Using the useNavigate hook for navigation purposes
    const navigate = useNavigate();

    // useEffect hook to fetch the recipe data when the component mounts or the ID changes
    useEffect(() => {
        // Asynchronous function to fetch the recipe from the backend
        const fetchRecipe = async() => {
            try {
                const response = await fetch(`http://localhost:5001/api/recipes/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setRecipe(data);
                } else {
                    console.error('Error fetching recipe:', data.message);
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        };

        // Call the fetchRecipe function
        fetchRecipe();
    }, [id]); // Dependency array for useEffect

    // If the recipe data hasn't been loaded yet, display a shimmer effect as a placeholder
    if (!recipe) return <Shimmer width = { 200 }
    height = { 200 }
    />;

    // Calculate the total calories for the recipe
    const totalCalories = recipe.ingredients.reduce((total, ingredient) => {
        return total + parseFloat(ingredient.kcal);
    }, 0);

    // Component JSX rendering
    return ( <
        div className = "bg-light-gray p-8 mb-10" > { /* Displaying the recipe image, title, prep time, and total calories */ } <
        div className = "flex mb-8 w-4/5 mx-auto shadow bg-gray-100 p-4 rounded-md" >
        <
        img src = { recipe.imageURL }
        alt = { recipe.title }
        className = "rounded-full w-40 h-40 object-cover" / >
        <
        div className = "ml-8" >
        <
        h1 className = "text-3xl font-bold mb-4" > { recipe.title } < /h1> <
        div className = "grid grid-cols-2 gap-4" >
        <
        div >
        <
        div > Prep Time: { recipe.prepTime } < /div> <
        div > Total Calories: { totalCalories.toFixed(2) } < /div> <
        /div> { /* Display if the recipe requires cooking */ } <
        div >
        Cook: { recipe.cook ? "Yes" : "No" } <
        /div> <
        /div> <
        /div> <
        /div>

        { /* Displaying the recipe instructions/method */ } <
        h2 className = "text-xl font-medium mb-4 w-4/5 mx-auto" > Method: < /h2> <
        div className = "w-4/5 mx-auto bg-gray-100 shadow p-4 mb-8 overflow-y-auto max-h-60 rounded-md" >
        <
        ol className = "list-decimal pl-6" > {
            recipe.instructions.map((inst, index) => ( <
                li key = { index }
                className = "mb-2 pl-4 relative before:absolute before:top-0 before:left-0 before:w-6 before:h-6 before:rounded-full before:content-['']" > { inst } <
                /li>
            ))
        } <
        /ol> <
        /div>

        { /* Displaying the recipe ingredients */ } <
        h2 className = "text-xl font-medium mb-4 w-4/5 mx-auto" > Ingredients: < /h2> <
        div className = "w-4/5 mx-auto bg-gray-100 shadow p-4 rounded-md overflow-y-auto max-h-60" >
        <
        table className = "w-full" >
        <
        thead >
        <
        tr > { /* Table headers for ingredients */ } <
        th className = "text-center" > Ingredients < /th> <
        th className = "text-center" > Quantity < /th> <
        th className = "text-center" > Fats < /th> <
        th className = "text-center" > Kcal < /th> <
        th className = "text-center" > Proteins < /th> <
        th className = "text-center" > Carbs < /th> <
        /tr> <
        /thead> <
        tbody > {
            recipe.ingredients.map((ingredient, index) => ( <
                tr key = { index } > { /* Displaying the ingredient details */ } <
                td className = "text-center" > { ingredient.name } < /td> <
                td className = "text-center" > { ingredient.quantity } < /td> <
                td className = "text-center" > { ingredient.fats } < /td> <
                td className = "text-center" > { ingredient.kcal } < /td> <
                td className = "text-center" > { ingredient.proteins } < /td> <
                td className = "text-center" > { ingredient.carbs } < /td> <
                /tr>
            ))
        } <
        /tbody> <
        /table> <
        /div>

        { /* Navigation button to go back */ } <
        div className = "w-4/5 mt-10 mx-auto" >
        <
        button onClick = {
            () => navigate(-1) }
        className = "bg-yellow-700  text-white py-2 px-4 hover:bg-dark-gold transition duration-300 ease-in-out rounded" > Go Back < /button> <
        /div> <
        /div>
    );
}

// Exporting the ViewRecipe component for use in other parts of the application
export default ViewRecipe;