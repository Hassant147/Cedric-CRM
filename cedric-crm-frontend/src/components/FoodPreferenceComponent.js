// Import the React library and the 'useState' hook for managing component state.
import React, { useState } from 'react';
// Import the 'useNavigate' hook from 'react-router-dom' for navigating between routes.
import { useNavigate } from 'react-router-dom';
// Import the 'axios' library for making HTTP requests.
import axios from 'axios';

// Define the functional component 'FoodPreferenceComponent'.
function FoodPreferenceComponent() {
    // Declare state variables for storing the food preference and any errors.
    const [preference, setPreference] = useState('regular'); // Initialize with 'regular' as the default value.
    const [error, setError] = useState(null);

    // Use the 'useNavigate' hook to get the 'navigate' function for routing.
    const navigate = useNavigate();

    // Define the asynchronous function 'handleSubmit' to handle form submissions.
    const handleSubmit = async (e) => {
        // Prevent the default form submission behavior.
        e.preventDefault();
        try {
            // Make an asynchronous GET request to fetch recipes based on the food preference.
            await axios.get('http://localhost:5001/api/recipes', {
                params: {
                    foodpreference: preference
                }
            });
            // Navigate to the '/recipes' route and pass the 'preference' as state.
            navigate('/recipes', { state: { data: preference } });  
        } catch (err) {
            // Log the error and update the 'error' state variable if the request fails.
            console.error("Error fetching recipes:", err);
            setError('Failed to fetch recipes. Please try again later.');
        }
    };
    
    // Define the JSX to be rendered.
    return (
        // Use utility classes for styling the component.
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-md w-1/3">
                <h2 className="text-xl font-bold mb-4">Select your food preference</h2>
                {/* Display an error message if it exists. */}
                {error && <div className="bg-red-200 text-red-600 p-2 rounded mb-4">{error}</div>}
                {/* Define the form and set its 'onSubmit' handler. */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Food Preference:
                        </label>
                        {/* Define the dropdown for selecting food preference. */}
                        <select 
                            value={preference} 
                            onChange={e => setPreference(e.target.value)} 
                            className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                            <option value="regular">Regular</option>
                            <option value="vegan">Vegan</option>
                            <option value="vegetarian">Vegetarian</option>
                            <option value="pescatarian">Pescatarian</option>
                        </select>
                    </div>
                    {/* Define the submit button for the form. */}
                    <input 
                        type="submit" 
                        value="Submit" 
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-800"
                    />
                </form>
            </div>
        </div>
    );
}

// Export the 'FoodPreferenceComponent' to be used in other parts of the application.
export default FoodPreferenceComponent;
