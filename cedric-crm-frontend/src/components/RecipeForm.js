// Import required modules from React and other libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

// Define the RecipeForm functional component
// It takes initialData for pre-populating form fields and an onSubmit function to handle form submission
function RecipeForm({ initialData = {}, onSubmit }) {

    // Declare state variables using React's useState hook
    // isEdited will track whether the form has been edited
    const [isEdited, setIsEdited] = useState(false);

    // Initialize navigation-related hooks
    const navigate = useNavigate();
    const location = useLocation();
    
    // Retrieve initial recipe data from the location's state if available
    const initialRecipeData = location.state?.recipe;
    
    // Declare a state variable showModal to control the visibility of a modal
    const [showModal, setShowModal] = useState(false);

    // Define a function to format JavaScript Date objects into a string format suitable for date input fields
    function formatForDateInput(date) {
        // Check if date is not provided or not an instance of Date, default to current date
        if (!date || !(date instanceof Date)) {
            date = new Date();
        }
        // Extract and format date components
        const yyyy = date.getFullYear().toString();
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const dd = date.getDate().toString().padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    
    // Get today's date, formatted for input fields
    const today = formatForDateInput(new Date());

    // Initialize default form data
    const defaultFormData = {
        // ... all form fields initialized to default values
    };

    // Format the dates in initialRecipeData if it exists
    if (initialRecipeData) {
        initialRecipeData.created_at = formatForDateInput(initialRecipeData.created_at);
        initialRecipeData.updated_at = formatForDateInput(initialRecipeData.updated_at);
        if (initialRecipeData.deleted_at) {
            initialRecipeData.deleted_at = formatForDateInput(initialRecipeData.deleted_at);
        }
    }

    // Initialize form state with either initialData or defaultFormData
    const formInitialState = initialData || defaultFormData;
    const [formData, setFormData] = useState(formInitialState);

    // useEffect hook to synchronize formData state with changes in initialData
    useEffect(() => {
        // Check if initialData has changed and if so, update formData
        if (formInitialState) {
            let hasChanges = false;
            for (let key in formInitialState) {
                if (formInitialState[key] !== formData[key]) {
                    hasChanges = true;
                    break;
                }
            }
            if (hasChanges) {
                setFormData(formInitialState);
            }
        }
    }, [formInitialState]);
   
       // Define a function to handle changes in the form fields
       const handleChange = (e) => {
        // Destructure the name and value from the event target
        const { name, value } = e.target;
        
        // Update the state of formData based on user input
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Mark the form as edited by setting isEdited to true
        setIsEdited(true);
    };
    
    // Define an asynchronous function to handle form submission
    const handleFormSubmit = async (event) => {
        // Prevent the default browser behavior of refreshing the page on form submit
        event.preventDefault();
    
        // Check if the form has been edited
        if (!isEdited) {
            // Show a modal warning if the form has not been edited
            setShowModal(true);
            return;
        }
        
        // Call the validate function and exit if validation fails
        if (!validate()) return;

        // Update the 'updated_at' field with the current date before sending the data
        const updatedFormData = { ...formData, updated_at: formatForDateInput(new Date()) };
        
        try {
            // If there's an ID in initialData, update the existing recipe; otherwise, create a new one
            if (initialData.id) {
                await axios.put(`http://localhost:5001/api/recipes/${initialData.id}`, updatedFormData);
            } else {
                await axios.post('http://localhost:5001/api/recipes', updatedFormData);
            }
            
            // If an onSubmit prop was passed, call it to notify the parent component
            if (onSubmit) {
                onSubmit();
            }
            // Navigate to the home page after successful submission
            navigate('/');
        } catch (err) {
            // Log any errors and update the component state or show a user-friendly error message
            console.error("Error processing the recipe:", err);
        }
    };
    
    // Initialize a state variable to keep track of validation errors
    const [errors, setErrors] = useState({});
    
    // Define a validation function
    const validate = () => {
        // Create an empty object to hold any validation errors
        const newErrors = {};
        
        // Validate each field and add errors to newErrors object
                // Validate the 'name_en' field: it must not be empty
        if (!formData.name_en) newErrors.name_en = "Name (EN) is required";
        
        // Validate the 'name_sv' field: it must not be empty
        if (!formData.name_sv) newErrors.name_sv = "Name (SV) is required";
        
        // Validate the 'minutes' field: it must not be empty
        if (!formData.minutes) newErrors.minutes = "Duration in minutes is required";
        
        // Validate the 'contributor_id' field: it must not be empty
        if (!formData.contributor_id) newErrors.contributor_id = "Contributor ID is required";
        
        // Validate the 'tags_en' field: it must not be empty
        if (!formData.tags_en) newErrors.tags_en = "Tags (EN) is required";
        
        // Validate the 'tags_sv' field: it must not be empty
        if (!formData.tags_sv) newErrors.tags_sv = "Tags (SV) is required";
        
        // Validate the 'steps_en' field: it must not be empty
        if (!formData.steps_en) newErrors.steps_en = "Steps (EN) is required";
        
        // Validate the 'steps_sv' field: it must not be empty
        if (!formData.steps_sv) newErrors.steps_sv = "Steps (SV) is required";
        
        // Validate the 'description_en' field: it must not be empty
        if (!formData.description_en) newErrors.description_en = "Description (EN) is required";
        
        // Validate the 'description_sv' field: it must not be empty
        if (!formData.description_sv) newErrors.description_sv = "Description (SV) is required";
        
        // Validate the 'ingredients_en' field: it must not be empty
        if (!formData.ingredients_en) newErrors.ingredients_en = "Ingredients (EN) is required";
        
        // Validate the 'ingredients_sv' field: it must not be empty
        if (!formData.ingredients_sv) newErrors.ingredients_sv = "Ingredients (SV) is required";
        
        // Validate the 'total_calories' field: it must not be empty
        if (!formData.total_calories) newErrors.total_calories = "Total calories are required";
        
        // Validate the 'nutrition' field: it must not be empty
        if (!formData.nutrition) newErrors.nutrition = "Nutrition details are required";
        
        // Validate the 'n_steps' field: it must not be empty
        if (!formData.n_steps) newErrors.n_steps = "Number of steps is required";
        
        // Validate the 'n_ingredients' field: it must not be empty
        if (!formData.n_ingredients) newErrors.n_ingredients = "Number of ingredients is required";
        
        // Validate the 'thumbnail' field: it must not be empty
        if (!formData.thumbnail) newErrors.thumbnail = "Thumbnail URL is required";
        
        // Validate the 'thumbnail_path' field: it must not be empty
        if (!formData.thumbnail_path) newErrors.thumbnail_path = "Thumbnail path is required";
        
        // Validate the 'foodpreference' field: it must not be empty
        if (!formData.foodpreference) newErrors.foodpreference = "Food preference is required";

        
        // Update the state with any new errors
        setErrors(newErrors);
        
        // Return true if there are no errors (i.e., the object is empty)
        return Object.keys(newErrors).length === 0;
    };
    return (
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 min-h-screen flex items-center justify-center p-10">
        <form onSubmit={handleFormSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-xl w-full">
             <h1 className="text-2xl font-bold mb-6 text-center">Recipe Form</h1>
 
             {/* Name (EN) */}
             <div className="mb-4">
                 <label className="block text-sm font-medium mb-2" htmlFor="name_en">
                     Name (EN):
                 </label>
                 <input type="text" name="name_en" value={formData.name_en} onChange={handleChange} 
                     className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                     placeholder="Enter Name in English" />
                 <p className="text-red-500 text-xs italic">{errors.name_en}</p>
             </div>
             {/* Name (SV) */}
             <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="name_sv">
                    Name (SV):
                </label>
                <input type="text" name="name_sv" value={formData.name_sv} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Enter Name in Swedish" />
                <p className="text-red-500 text-xs italic">{errors.name_sv}</p>
            </div>

            {/* Minutes */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="minutes">
                    Minutes:
                </label>
                <input type="number" name="minutes" value={formData.minutes} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Duration in minutes" />
                <p className="text-red-500 text-xs italic">{errors.minutes}</p>
            </div>

            {/* Contributor ID */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="contributor_id">
                    Contributor ID:
                </label>
                <input type="number" name="contributor_id" value={formData.contributor_id} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="ID of contributor" />
                <p className="text-red-500 text-xs italic">{errors.contributor_id}</p>
            </div>

            {/* Submitted */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="submitted">
                    Submitted:
                </label>
                <input type="text" name="submitted" value={formData.submitted} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Submission details" />
                <p className="text-red-500 text-xs italic">{errors.submitted}</p>
            </div>

            {/* Tags (EN) */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="tags_en">
                    Tags (EN):
                </label>
                <textarea name="tags_en" value={formData.tags_en} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Tags in English"></textarea>
                <p className="text-red-500 text-xs italic">{errors.tags_en}</p>
            </div>

            {/* Tags (SV) */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="tags_sv">
                    Tags (SV):
                </label>
                <textarea name="tags_sv" value={formData.tags_sv} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Tags in Swedish"></textarea>
                <p className="text-red-500 text-xs italic">{errors.tags_sv}</p>
            </div>

            {/* Nutrition */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="nutrition">
                    Nutrition:
                </label>
                <textarea name="nutrition" value={formData.nutrition} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Nutrition details"></textarea>
                <p className="text-red-500 text-xs italic">{errors.nutrition}</p>
            </div>

            {/* Steps Count */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="n_steps">
                    Steps Count:
                </label>
                <input type="number" name="n_steps" value={formData.n_steps} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Number of steps" />
                <p className="text-red-500 text-xs italic">{errors.n_steps}</p>
            </div>

            {/* Steps (EN) */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="steps_en">
                    Steps (EN):
                </label>
                <textarea name="steps_en" value={formData.steps_en} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Steps in English"></textarea>
                <p className="text-red-500 text-xs italic">{errors.steps_en}</p>
            </div>

            {/* Steps (SV) */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="steps_sv">
                    Steps (SV):
                </label>
                <textarea name="steps_sv" value={formData.steps_sv} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Steps in Swedish"></textarea>
                <p className="text-red-500 text-xs italic">{errors.steps_sv}</p>
            </div>

            {/* Description (EN) */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="description_en">
                    Description (EN):
                </label>
                <textarea name="description_en" value={formData.description_en} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Description in English"></textarea>
                <p className="text-red-500 text-xs italic">{errors.description_en}</p>
            </div>

            {/* Description (SV) */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="description_sv">
                    Description (SV):
                </label>
                <input type="text" name="description_sv" value={formData.description_sv} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Description in Swedish" />
                <p className="text-red-500 text-xs italic">{errors.description_sv}</p>
            </div>

            {/* Ingredients (EN) */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="ingredients_en">
                    Ingredients (EN):
                </label>
                <textarea name="ingredients_en" value={formData.ingredients_en} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    placeholder="Ingredients in English"></textarea>
                <p className="text-red-500 text-xs italic">{errors.ingredients_en}</p>
            </div>

            {/* Ingredients (SV) */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="ingredients_sv">
                    Ingredients (SV):
                </label>
                <input type="text" name="ingredients_sv" value={formData.ingredients_sv} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Ingredients in Swedish" />
                <p className="text-red-500 text-xs italic">{errors.ingredients_sv}</p>
            </div>

            {/* Ingredient Count */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="n_ingredients">
                    Ingredient Count:
                </label>
                <input type="number" name="n_ingredients" value={formData.n_ingredients} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Number of ingredients" />
                <p className="text-red-500 text-xs italic">{errors.n_ingredients}</p>
            </div>
            {/* Total Calories */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="total_calories">
                    Total Calories:
                </label>
                <input type="number" name="total_calories" value={formData.total_calories} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Total calories" />
                <p className="text-red-500 text-xs italic">{errors.total_calories}</p>
            </div>

            {/* Thumbnail (URL/Text) */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="thumbnail">
                    Thumbnail (URL/Text):
                </label>
                <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Thumbnail URL" />
                <p className="text-red-500 text-xs italic">{errors.thumbnail}</p>
            </div>

            {/* Thumbnail Path */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="thumbnail_path">
                    Thumbnail Path:
                </label>
                <input type="text" name="thumbnail_path" value={formData.thumbnail_path} onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" 
                    placeholder="Thumbnail path" />
                <p className="text-red-500 text-xs italic">{errors.thumbnail_path}</p>
            </div>
{/* Default Image */}
<div className="mb-4 flex items-center">
                <input type="checkbox" name="defaulted_image" checked={formData.defaulted_image} onChange={(e) => setFormData(prev => ({ ...prev, defaulted_image: e.target.checked }))} 
                    className="mr-2 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                <label className="text-sm font-medium" htmlFor="defaulted_image">
                    Default Image
                </label>
                {/* No error message here since it's a checkbox */}
            </div>

           {/* Created At */}
           <div className="mb-4">
    <label className="block text-sm font-medium mb-2" htmlFor="created_at">
        Creation date:
    </label>
    <input type="date" name="created_at" value={formData.created_at} onChange={handleChange} readOnly  
        className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        placeholder="dd/mm/yyyy" />
</div>


                {/* Updated At */}
                <div className="mb-4">
    <label className="block text-sm font-medium mb-2" htmlFor="updated_at">
        Updated At:
    </label>
    <input type="date" name="updated_at" value={formData.updated_at} onChange={handleChange} readOnly  
        className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        placeholder="dd/mm/yyyy" />
</div>



            {/* Deleted At */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="deleted_at">
                    Deleted At:
                </label>
                <input type="date" name="deleted_at" value={formatForDateInput(formData.deleted_at)}
                onChange={handleChange} 
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                <p className="text-red-500 text-xs italic">{errors.deleted_at}</p>
            </div>

            {/* Food Preference */}
            <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="foodpreference">
                    Food Preference:
                </label>
                <select name="foodpreference" value={formData.foodpreference} onChange={handleChange}
                    className="border rounded w-full py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
                    <option value="">Select Preference</option>
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="pescatarian">Pescatarian</option>
                    <option value="regular">Regular</option>
                </select>
                <p className="text-red-500 text-xs italic">{errors.foodpreference}</p>
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={() => navigate(-1)} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-800 mr-4">
                        Back
                    </button>
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200 active:bg-blue-800">
                        Save
                    </button>
                </div>

            </form>
            {/* New Modal code */}
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Alert
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Please make an edit first before saving. If you don't want to save, you can go back by clicking on the back button.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" onClick={() => setShowModal(false)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RecipeForm;