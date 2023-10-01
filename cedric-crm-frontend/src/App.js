// Importing required modules from react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing the various components used in the app
import EditRecipe from './components/EditRecipe';
import RecipeForm from './components/RecipeForm';
import ViewRecipe from './components/ViewRecipe';
import FoodPreferenceComponent from './components/FoodPreferenceComponent';
import RecipeCategoryComponent from './components/RecipeCategoryComponent';
import RecipeListComponent from './components/RecipeListComponent';
import './i18n';


// Main App component
function App() {
    return (
        // BrowserRouter wraps the entire application and provides routing capabilities
        <
        Router >
        <
        div className = "App" > { /* Routes component holds all the individual Route components */ } <
        Routes > { /* Route for the homepage which renders the FoodPreferenceComponent */ } <
        Route path = "/"
        element = { < FoodPreferenceComponent / > }
        />

        { /* Route for adding a new recipe, renders the RecipeForm component */ } <
        Route path = "/add-recipe"
        element = { < RecipeForm / > }
        />

        { /* Route for editing a recipe by its ID, renders the EditRecipe component */ } <
        Route path = "/edit-recipe/:id"
        element = { < EditRecipe / > }
        />

        { /* Route for viewing a single recipe by its ID, renders the ViewRecipe component */ } <
        Route path = "/recipe/:id"
        element = { < ViewRecipe / > }
        />

        { /* Route for viewing recipes by a specific preference, renders the RecipeCategoryComponent */ } <
        Route path = "/preferences/:preference"
        element = { < RecipeCategoryComponent / > }
        />

        { /* Route for viewing recipes by a specific preference and category, renders the RecipeListComponent */ } <
        Route path = "/preferences/:preference/:category"
        element = { < RecipeListComponent / > }
        /> <
        /Routes> <
        /div> <
        /Router>
    );
}

// Exporting the App component so it can be used elsewhere in the application
export default App;