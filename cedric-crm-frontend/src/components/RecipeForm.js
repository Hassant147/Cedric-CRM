// Importing required hooks and modules from React and react-router-dom for creating the RecipeForm component.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Define the RecipeForm functional component. The component accepts two props: recipe (with a default of null) and isEditing (with a default of false).
function RecipeForm({ recipe = null, isEditing = false }) {
    // Use the useNavigate hook from react-router-dom to navigate programmatically within the application.
    const navigate = useNavigate();

    // Use the useLocation hook from react-router-dom to access the current location object which contains information about the current URL.
    const location = useLocation();

    // Logging the state from the current location to the console.
    console.log("Received state in RecipeForm:", location.state);

    // Retrieve category and defaultPreference from the location state, and set default values if they are not present.
    const category = location.state && location.state.category ? location.state.category : '';
    const defaultPreference = location.state && location.state.defaultPreference ? location.state.defaultPreference : 'regular';

    // Initialize state for various fields of the recipe form using the useState hook. 
    // If the recipe prop is provided, use its values; otherwise, set default values.
    const [title, setTitle] = useState(recipe && recipe.title || '');
    const [description, setDescription] = useState(recipe && recipe.description || '');
    const [foodPreference, setFoodPreference] = useState(recipe && recipe.foodPreference || defaultPreference);
    const [recipeType, setRecipeType] = useState(recipe && recipe.recipeType || category || '');
    const [instructions, setInstructions] = useState(recipe && recipe.instructions || []);
    const [imageURL, setImageURL] = useState(recipe && recipe.imageURL || '');
    const [allergenFree, setAllergenFree] = useState(recipe && recipe.allergenFree || '');
    const [ingredients, setIngredients] = useState(recipe && recipe.ingredients || []);

    // Define a function to handle changes in the ingredients fields. This function updates a specific ingredient's property based on the provided index and field.
    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...ingredients];

        // If the ingredient at the provided index does not exist, initialize it as an empty object.
        if (!newIngredients[index]) {
            newIngredients[index] = {};
        }

        // Update the specified field of the ingredient with the provided value.
        newIngredients[index][field] = value;

        // Update the ingredients state with the modified ingredients array.
        setIngredients(newIngredients);
    };

    // Define a function to add a new ingredient to the ingredients list.
    const handleAddIngredient = () => {
        // Add a new ingredient with default empty properties to the ingredients list.
        setIngredients([...ingredients, { name: '', quantity: '', fats: '', kcal: '', proteins: '', carbs: '' }]);
    };

    // Define an asynchronous function to handle the submission of the recipe form.
    const handleSubmit = async(e) => {
        // Prevent the default behavior of form submission.
        e.preventDefault();

        // If instructions are provided as a string (with newlines), split it into an array; otherwise, use the array format directly.
        let formattedInstructions = Array.isArray(instructions) ? instructions : instructions.split('\n');

        // Check if any ingredient is missing either the name or quantity. If so, show an alert.
        if (ingredients.some(ingredient => !ingredient.name || !ingredient.quantity)) {
            alert("Please fill out all ingredient fields.");
            return;
        }

        // Construct the recipe data object from the state variables.
        const recipeData = {
            title,
            description,
            instructions: formattedInstructions,
            imageURL,
            foodPreference,
            recipeType,
            allergenFree,
            creationDate: new Date(),
            lastUpdatedDate: new Date(),
            ingredients
        };

        // Determine the endpoint and HTTP method based on whether the form is in editing mode or not.
        const endpoint = isEditing ?
            `http://localhost:5100/api/recipes/${recipe._id}` :
            'http://localhost:5100/api/recipes';
        const httpMethod = isEditing ? 'PUT' : 'POST';

        // Log the constructed recipe data to the console.
        console.log(recipeData);

        // Try making the HTTP request to the determined endpoint.
        try {
            const response = await fetch(endpoint, {
                method: httpMethod,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recipeData),
            });

            // Convert the response to JSON format.
            const data = await response.json();

            // If the response is successful, reset the form fields and navigate back.
            if (response.ok) {
                setTitle('');
                setDescription('');
                setInstructions('');
                setImageURL('');
                setFoodPreference('');
                setAllergenFree('');
                setIngredients([{ name: '', quantity: '', fats: '', kcal: '', proteins: '', carbs: '' }]);
                navigate(-1);
            } else {
                // If there's an error in the response, log the error message.
                const action = isEditing ? 'updating the recipe' : 'adding the recipe';
                console.error(`Error ${action}:`, data.message);
            }
        } catch (error) {
            // If there's a network or any other error, log it to the console.
            console.error('Network error:', error);
        }
    };

    // Render the JSX for the RecipeForm.
    return ( <
        div className = "bg-light-gray p-8" > { /* // Display a header for the form. */ } <
        h1 className = "text-3xl font-bold mb-6 mx-auto w-4/5" > Add Recipe < /h1> { /* // Define the form element with an onSubmit event handler. */ } <
        form onSubmit = { handleSubmit }
        className = "space-y-4 w-4/5 mx-auto bg-gray-100 shadow p-4 rounded-md" > { /* // Create a form group for the recipe title. */ } <
        div >
        <
        label htmlFor = "title"
        className = "block text-sm font-medium text-gray-700" > Title < /label> <
        input type = "text"
        id = "title"
        name = "title"
        value = { title }
        onChange = { e => setTitle(e.target.value) }
        className = "mt-1 p-2 w-full border rounded-md" /
        >
        <
        /div> { /* // Create a form group for the recipe description. */ } <
        div >
        <
        label htmlFor = "description"
        className = "block text-sm font-medium text-gray-700" > Description < /label> <
        textarea id = "description"
        name = "description"
        value = { description }
        onChange = { e => setDescription(e.target.value) }
        className = "mt-1 p-2 w-full border rounded-md" >
        < /textarea> <
        /div> { /* // Create a form group for the recipe instructions. */ } <
        div >
        <
        label htmlFor = "instructions"
        className = "block text-sm font-medium text-gray-700" > Instructions < /label> <
        textarea id = "instructions"
        name = "instructions"
        value = { instructions }
        onChange = { e => setInstructions(e.target.value) }
        className = "mt-1 p-2 w-full border rounded-md" >
        < /textarea> <
        /div> { /* // Render the list of ingredients. */ } <
        div >
        <
        h2 className = "text-xl font-bold mb-2" > Ingredients: < /h2> { /* // Use the map function to render each ingredient and its associated input fields. */ } {
            ingredients.map((ingredient, index) => ( <
                div key = { index }
                className = "grid grid-cols-6 gap-4 mb-2" >
                <
                input placeholder = "Name"
                type = "text"
                value = { ingredient.name }
                onChange = { e => handleIngredientChange(index, 'name', e.target.value) }
                className = "mt-1 p-2 w-full border rounded-md" /
                >
                <
                input placeholder = "Quantity"
                type = "text"
                value = { ingredient.quantity }
                onChange = { e => handleIngredientChange(index, 'quantity', e.target.value) }
                className = "mt-1 p-2 w-full border rounded-md" /
                >
                <
                input placeholder = "Fats"
                type = "number" // changed to number
                min = "0" // prevent negative values
                value = { ingredient.fats }
                onChange = { e => handleIngredientChange(index, 'fats', e.target.value) }
                className = "mt-1 p-2 w-full border rounded-md" /
                >
                <
                input placeholder = "Kcal"
                type = "number" // changed to number
                min = "0" // prevent negative values
                value = { ingredient.kcal }
                onChange = { e => handleIngredientChange(index, 'kcal', e.target.value) }
                className = "mt-1 p-2 w-full border rounded-md" /
                >
                <
                input placeholder = "Proteins"
                type = "number" // changed to number
                min = "0" // prevent negative values
                value = { ingredient.proteins }
                onChange = { e => handleIngredientChange(index, 'proteins', e.target.value) }
                className = "mt-1 p-2 w-full border rounded-md" /
                >
                <
                input placeholder = "Carbs"
                type = "number" // changed to number
                min = "0" // prevent negative values
                value = { ingredient.carbs }
                onChange = { e => handleIngredientChange(index, 'carbs', e.target.value) }
                className = "mt-1 p-2 w-full border rounded-md" /
                >
                <
                /div>
            ))
        } { /* // Add a button to allow users to add more ingredients to the form. */ } <
        button type = "button"
        onClick = { handleAddIngredient }
        className = "mb-4 bg-yellow-700 text-white py-2 px-4 hover:bg-dark-gold transition duration-300 ease-in-out rounded" >
        +Add Another Ingredient <
        /button> <
        /div> { /* // Create a form group for the recipe image URL. */ } <
        div >
        <
        label htmlFor = "imageURL"
        className = "block text-sm font-medium text-gray-700" > Image URL < /label> <
        input type = "url"
        id = "imageURL"
        name = "imageURL"
        value = { imageURL }
        onChange = { e => setImageURL(e.target.value) }
        className = "mt-1 p-2 w-full border rounded-md" /
        >
        <
        /div> { /* // Create a dropdown for selecting the food preference. */ } <
        div >
        <
        label htmlFor = "foodPreference" > Food Preference: < /label> <
        select name = "foodPreference"
        value = { foodPreference }
        onChange = { e => setFoodPreference(e.target.value) } >
        <
        option value = "regular" > Regular < /option> <
        option value = "pescatarian" > Pescatarian < /option> <
        option value = "vegetarian" > Vegetarian < /option> <
        option value = "vegan" > Vegan < /option> <
        /select> <
        /div> { /* // Create a dropdown for selecting the recipe type. */ } <
        div >
        <
        label htmlFor = "recipeType" > Recipe Type: < /label> <
        select name = "recipeType"
        value = { recipeType }
        onChange = { e => setRecipeType(e.target.value) } >
        <
        option value = ""
        disabled > Select a Recipe Type < /option> <
        option value = "Pasta" > Pasta < /option> <
        option value = "Boiled Rice" > Boiled Rice < /option> <
        option value = "Salad" > Salad < /option> <
        option value = "Soup" > Soup < /option> <
        option value = "Dessert" > Dessert < /option> <
        /select> <
        /div> { /* // Create a form group for specifying allergen-free information. */ } <
        div >
        <
        label htmlFor = "allergenFree"
        className = "block text-sm font-medium text-gray-700" > Allergen Free < /label> <
        input type = "text"
        id = "allergenFree"
        name = "allergenFree"
        value = { allergenFree }
        onChange = { e => setAllergenFree(e.target.value) }
        className = "mt-1 p-2 w-full border rounded-md" /
        >
        <
        /div> { /* // Add buttons to submit the form or navigate back. */ } <
        div class = 'space-x-6' >
        <
        button type = "submit"
        className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" > { isEditing ? "Save Changes" : "Add Recipe" } <
        /button> <
        button type = "button"
        onClick = {
            () => navigate(-1) }
        className = "px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 mr-2" >
        Back <
        /button> <
        /div> <
        /form> <
        /div>
    );
}

// Export the RecipeForm component for use in other parts of the application.
export default RecipeForm;