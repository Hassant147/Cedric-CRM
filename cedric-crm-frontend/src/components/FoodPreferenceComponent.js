// Importing necessary modules
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';

// FoodPreferenceComponent function component
function FoodPreferenceComponent() {
    // Using the useNavigate hook to get the navigate function for navigation
    const navigate = useNavigate();

    // Function to handle the click event on the preference buttons
    const handlePreferenceClick = (preference) => {
        // Navigating to the preference route with the clicked preference value
        navigate(`/preferences/${preference}`);
    }

    return (
        // Container for the food preferences
        <
        div className = "food-preference-container common-container" > { /* Heading for the component */ } <
        h2 className = "common-heading" > Select Your Food Preference < /h2>

        { /* Group of buttons for different food preferences */ } <
        div className = "preferences btn-group" > { /* Each button calls the handlePreferenceClick function with its respective preference value */ } <
        button className = "btn"
        onClick = {
            () => handlePreferenceClick('regular') } > Regular < /button> <
        button className = "btn"
        onClick = {
            () => handlePreferenceClick('pescatarian') } > Pescatarian < /button> <
        button className = "btn"
        onClick = {
            () => handlePreferenceClick('vegetarian') } > Vegetarian < /button> <
        button className = "btn"
        onClick = {
            () => handlePreferenceClick('vegan') } > Vegan < /button> <
        /div>

        { /* Button to navigate to the add recipe page */ } <
        div className = "mt-6" >
        <
        button className = "btn add-recipe-btn"
        onClick = {
            () => navigate('/add-recipe') } > +Add Recipe < /button> <
        /div> <
        /div>
    );
}

// Exporting the FoodPreferenceComponent for use in other parts of the application
export default FoodPreferenceComponent;