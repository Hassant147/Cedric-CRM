/*
  Import required modules and components from React and other libraries.
*/
// Import React and the useState and useEffect hooks from the React library.
import React, { useState, useEffect } from 'react';  

// Import the Link component from react-router-dom for navigation.
import { Link } from 'react-router-dom';  

// Import useLocation hook to get the current location object.
import { useLocation } from 'react-router-dom';  

// Import useNavigate hook to programmatically navigate between routes.
import { useNavigate } from 'react-router-dom';  

// Import PaginationComponent for paginating the recipes list.
import PaginationComponent from './PaginationComponent';  

// Import ShimmerEffect component to show a loading effect.
import ShimmerEffect from './shimmer';  

// Import Axios for making API requests.
import axios from 'axios';  

/*
  Utility function to format a date string into a specific format.
*/
// Define a function called formatDate that takes a dateString parameter.
const formatDate = (dateString) => {  

    // Convert the dateString to a Date object.
    const date = new Date(dateString);  

    // Get the day of the month from the date object.
    let dd = date.getDate();  

    // Get the month from the date object and add 1 because JavaScript months start from 0.
    let mm = date.getMonth() + 1;  

    // Get the full year from the date object.
    const yyyy = date.getFullYear();  

    // Pad the day and month with a 0 if they are less than 10.
    if (dd < 10) {
        dd = '0' + dd;  // Add a leading zero to the day if it's less than 10.
    }
    if (mm < 10) {
        mm = '0' + mm;  // Add a leading zero to the month if it's less than 10.
    }

    // Return the formatted date string in yyyy-mm-dd format.
    return yyyy + '-' + mm + '-' + dd;  
};

/*
  Main functional component for listing recipes.
*/
// Define a functional component called RecipeListComponent.
function RecipeListComponent() {  

    // Declare and initialize state variables using the useState hook.
    const [totalPages, setTotalPages] = useState(1);  // State for total number of pages; initialized to 1.

    // State for managing the expansion of text; initialized as an empty object.
    const [expandedText, setExpandedText] = useState({});  

    // State for the field to sort by; initialized to 'id'.
    const [sortField, setSortField] = useState('id');  

    // State for the direction of sort; initialized to 'ASC' (ascending).
    const [sortDirection, setSortDirection] = useState('ASC');  

        // Declare more state variables.
    
    // Use the useNavigate hook to get the navigate function for programmatic navigation.
    const navigate = useNavigate();  
    
    // State for storing an array of recipes; initialized as an empty array.
    const [recipes, setRecipes] = useState([]);  
    
    // State for storing the search term; initialized as an empty string.
    const [searchTerm, setSearchTerm] = useState('');  
    
    // State for the current page in pagination; initialized to 1.
    const [currentPage, setCurrentPage] = useState(1);  
    
    // State for storing any error message; initialized to null.
    const [error, setError] = useState(null);  
    
    // State for storing any success message; initialized to null.
    const [success, setSuccess] = useState(null);  
    
    // State for tracking if data is currently being loaded; initialized to false.
    const [isLoading, setIsLoading] = useState(false);  
    
    // Use the useLocation hook to get the current location object.
    const location = useLocation();  
    
    const [tempSortField, setTempSortField] = useState(sortField);  // Line 1
    const [tempSortDirection, setTempSortDirection] = useState(sortDirection);  // Line 2


    // Extract the food preference from the location state if available.
    const foodPreferenceFromState = location.state?.data;  

    /*
      Function to toggle the expansion of text in a row.
    */
    // Define a function called toggleExpandText that takes an id parameter.
    const toggleExpandText = (id) => {  
        
        // Use setExpandedText to update the expandedText state.
        setExpandedText(prev => ({ ...prev, [id]: !prev[id] }));  
    };

    /*
      Function to fetch recipes from the API.
    */
    // Define an asynchronous function called fetchRecipes.
    const fetchRecipes = async () => {  
        
        // Set the isLoading state to true when fetching begins.
        setIsLoading(true);  

        // Wrap the API call in a try-catch block to handle errors.
        try {  

                       // Set the isLoading state to true to indicate that data fetching has started.
                       setIsLoading(true);  
            
                       // Make an API call to fetch recipes.
                       const response = await axios.get('http://localhost:5001/api/recipes', {  
                           params: {
                               // Limit the number of recipes per page to 10.
                               limit: 10,  
                               
                               // Calculate the offset for pagination.
                               offset: (currentPage - 1) * 10,  
                               
                               // Include the search term if any.
                               search: searchTerm,  
                               
                               // Include the field to sort by.
                               sortField: sortField,  
                               
                               // Include the sort direction.
                               sortDirection: sortDirection,  
                               
                               // Include food preference from the state if available.
                               foodpreference: foodPreferenceFromState ? foodPreferenceFromState : null,  
                           }
                       });
           
                       // Map through the received recipes to format their date fields.
                       const formattedRecipes = response.data.recipes.map(recipe => ({  
                           ...recipe,
                           
                           // Format the created_at date.
                           created_at: formatDate(recipe.created_at),  
                           
                           // Format the updated_at date.
                           updated_at: formatDate(recipe.updated_at),  
                           
                           // Format the deleted_at date only if it exists.
                           deleted_at: recipe.deleted_at ? formatDate(recipe.deleted_at) : null  
                       }));
                       
                       // Update the recipes state with the formatted recipes.
                       setRecipes(formattedRecipes);  
                       
                       // Set isLoading back to false to indicate that data fetching is complete.
                       setIsLoading(false);  
                       
                       // Extract the total count of recipes from the response.
                       const totalCount = response.data.totalCount;  
                       
                       // Calculate the total number of pages needed for pagination.
                       const totalPages = Math.ceil(totalCount / 10);  
                       
                       // Update the totalPages state.
                       setTotalPages(totalPages);  
                       
                   } catch (err) {  // Handle errors
                       
                       // Log the error to the console.
                       console.error("Error fetching recipes:", err);  
                       
                       // Set the error state to display an error message.
                       setError('Failed to fetch recipes. Please try again later.');  
                       
                       // Set isLoading back to false in case of an error.
                       setIsLoading(false);  
                   }
               };
           
                // useEffect to call fetchRecipes initially and when currentPage or searchTerm changes.
                useEffect(() => {  
                    fetchRecipes();  // Call fetchRecipes
                }, [currentPage, searchTerm, sortField, sortDirection]);  // Updated dependencies for useEffect
                

           
               // Define a function called handleSearch to handle the search operation.
               const handleSearch = () => {  
                // Update sortField and sortDirection with tempSortField and tempSortDirection
                setSortField(tempSortField);
                setSortDirection(tempSortDirection);
            
                // Reset the currentPage to 1 when a new search is initiated.
                setCurrentPage(1);
                 };
            
               
               // Define an asynchronous function called handleDeleteRecipe to handle recipe deletion.
               const handleDeleteRecipe = async (recipeId) => {  
           
                   // Wrap the API call in a try-catch block to handle errors.
                   try {  
           
                       // Make an API call to delete the recipe with the given recipeId.
                       await axios.delete(`http://localhost:5001/api/recipes/${recipeId}`);  
                       
                       // Call fetchRecipes to refresh the list after deletion.
                       fetchRecipes();  
                       
                       // Set the success state to display a success message.
                       setSuccess('Recipe deleted successfully.');  
                   } catch (err) {  // Handle errors
                       
                       // Log the error to the console.
                       console.error("Error deleting the recipe:", err);  
                       
                       // Set the error state to display an error message.
                       setError('Failed to delete the recipe. Please try again later.');  
                   }
               };
           
               // The main JSX return block starts here.
               return (  
                   // The outermost div that sets the minimum height and padding.
                   <div className="min-h-screen bg-gray-100 p-5">  
                       {/* // A div that contains the main content. */}
                       <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-md">  
                           {/* // Display error message if error state is not null. */}
                           {error && <div className="mb-5 text-center p-3 rounded bg-red-500 text-white">{error}</div>}  
                           {/* // Display success message if success state is not null. */}
                           {success && <div className="mb-5 text-center p-3 rounded bg-green-500 text-white">{success}</div>}  
                           
                           {/* // A div that contains the search input and button. */}
                           <div className="flex justify-between mb-5">  
                               {/* // A div that wraps the search input. */}
                               <div className="flex-1 mr-4">  
                                   {/* // The search input field. */}
                                   <input   
                                       type="text"  
                                       value={searchTerm}  
                                       onChange={e => setSearchTerm(e.target.value)}  
                                       placeholder="Search recipes..."  
                                       className="w-full p-2 rounded border focus:border-blue-500 focus:outline-none focus:shadow-outline"  
                                   />
                               </div>
                               {/* // The search button. */}
                               <button onClick={handleSearch} className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline">  
                                   Search  
                               </button>  
                           </div>
                           {/* // A div that contains the dropdown for sorting the recipes. */}
                <div className="mb-4">  
                    {/* // A label for the sort dropdown. */}
                    <label className="mr-2">Sort by:</label>  
                    
                    {/* // The sort dropdown element. */}
                    <select   
                        value={`${tempSortField}-${tempSortDirection}`}  
                        onChange={(e) => {  
                            const [field, direction] = e.target.value.split("-");  
                            setTempSortField(field);  
                            setTempSortDirection(direction);  
                        }}  
                         >

                        {/* // Various sort options. */}
                        <option value="id-ASC">ID (Ascending)</option>  
                        <option value="id-DESC">ID (Descending)</option>  
                        <option value="name_en-ASC">Name (Ascending)</option>  
                        <option value="name_en-DESC">Name (Descending)</option>  
                        <option value="total_calories-ASC">Calories (Low to High)</option>  
                        <option value="total_calories-DESC">Calories (High to Low)</option>  
                        <option value="updated_at-ASC">Date Modified (Oldest to Newest)</option>  
                        <option value="updated_at-DESC">Date Modified (Newest to Oldest)</option>  
                    </select>  
                </div>

                {/* // A div that contains the "Add Recipe" and "Home" buttons. */}
                <div className="flex justify-between items-center mb-4">  
                    
                    {/* // A link to navigate to the Add Recipe page. */}
                    <Link   
                        to="/add-recipe"  
                        className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline"  
                    >
                        Add Recipe  
                    </Link>  
                    
                    {/* // A button that navigates back to the Home page. */}
                    <button   
                        onClick={() => navigate('/')}  
                        className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"  
                    >
                        Home  
                    </button>  
                </div>

                {/* // A conditional block to display either a loading state or the actual data. */}
                {isLoading ? (  
                    // The loading state starts here.
                    <div className="shimmer-table">  
                        {/* // A div that mimics the table header using a shimmer effect. */}
                        <div className="shimmer-row">  
                            {/* // Shimmer effect for each cell in the header. */}
                            <div className="shimmer-cell">  
                                <ShimmerEffect width={50} height={20} borderRadius={4} />  
                            </div>
           
                            {/* // Another shimmer cell to mimic the header. */}
                            <div className="shimmer-cell">  
                                <ShimmerEffect width={100} height={20} borderRadius={4} />  
                            </div>  
                            {/* // Another shimmer cell to mimic the header. */}
                            <div className="shimmer-cell">  
                                <ShimmerEffect width={200} height={20} borderRadius={4} />  
                            </div>  
                            {/* // Another shimmer cell to mimic the header. */}
                            <div className="shimmer-cell">  
                                <ShimmerEffect width={150} height={20} borderRadius={4} />  
                            </div>  
                            {/* // Another shimmer cell to mimic the header. */}
                            <div className="shimmer-cell">  
                                <ShimmerEffect width={200} height={20} borderRadius={4} />  
                            </div>  
                            {/* // Another shimmer cell to mimic the header. */}
                            <div className="shimmer-cell">  
                                <ShimmerEffect width={150} height={20} borderRadius={4} />  
                            </div>  
                            {/* // Another shimmer cell to mimic the header. */}
                            <div className="shimmer-cell">  
                                <ShimmerEffect width={100} height={20} borderRadius={4} />  
                            </div>  
                        </div>  
                        
                        {/* // Mimic 10 table rows using the shimmer effect for loading. */}
                        {[...Array(10)].map((_, index) => (  
                            // A div for each shimmer row.
                            <div className="shimmer-row" key={index}>  
                                {/* // Shimmer cell to mimic the data cell in the row. */}
                                <div className="shimmer-cell">  
                                    <ShimmerEffect width={50} height={20} borderRadius={4} />  
                                </div>  
                                {/* // Another shimmer cell to mimic the data cell in the row. */}
                                <div className="shimmer-cell">  
                                    <ShimmerEffect width={100} height={20} borderRadius={4} />  
                                </div>  
                                {/* // Another shimmer cell to mimic the data cell in the row. */}
                                <div className="shimmer-cell">  
                                    <ShimmerEffect width={200} height={20} borderRadius={4} />  
                                </div>  
                                {/* // Another shimmer cell to mimic the data cell in the row. */}
                                <div className="shimmer-cell">  
                                    <ShimmerEffect width={150} height={20} borderRadius={4} />  
                                </div>  
                                {/* // Another shimmer cell to mimic the data cell in the row. */}
                                <div className="shimmer-cell">  
                                    <ShimmerEffect width={200} height={20} borderRadius={4} />  
                                </div>  
                                {/* // Another shimmer cell to mimic the data cell in the row. */}
                                <div className="shimmer-cell">  
                                    <ShimmerEffect width={150} height={20} borderRadius={4} />  
                                </div>  
                                {/* // Another shimmer cell to mimic the data cell in the row. */}
                                <div className="shimmer-cell">  
                                    <ShimmerEffect width={100} height={20} borderRadius={4} />  
                                </div>  
                            </div>  
                        ))}  
                    </div>  
                ) : (  
                    // The actual table displaying data starts here.
                    <table className="min-w-full bg-white mt-9">  
                        {/* // Table header. */}
                        <thead>  
                            {/* // A row for the table header. */}
                            <tr>  
                                {/* // Header cell for ID. */}
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">ID</th>  
                                {/* // Header cell for Name. */}
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Name</th>  
                                {/* // Header cell for Description in English. */}
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Description (EN)</th>  
                                {/* // Header cell for Total Calories. */}
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Total Calories</th>  
                                {/* // Header cell for Ingredients in English. */}
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Ingredients (EN)</th>  
                                {/* // Header cell for Date Modified. */}
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">Date Modified</th>  
                                {/* // Header cell for Actions. */}
                                <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-center">Actions</th>  
                            </tr>  
                        </thead>
                        {/* // Table body where data rows will be displayed. */}
                        <tbody>  
                            {/* // Iterating through the 'recipes' array to render each recipe's data in a row. */}
                            {recipes.map(recipe => (  
                                // A row for each recipe, uniquely identified by its 'id'.
                                <tr key={recipe.id}>  
                                    {/* // Cell to display the 'id' of the recipe. */}
                                    <td className="py-2 px-4 border-b border-gray-200 text-left">{recipe.id}</td>  
                                    {/* // Cell to display the 'name_en' (Name in English) of the recipe. */}
                                    <td className="py-2 px-4 border-b border-gray-200 text-left">{recipe.name_en}</td>  
                                    {/* // Cell to display the 'description_en' (Description in English) of the recipe. */}
                                    <td className="py-2 px-4 border-b border-gray-200 text-left">  
                                        {/* // Ternary operator to check whether text should be expanded or not for the given recipe 'id'. */}
                                        {expandedText[recipe.id] ?   
                                            // If expandedText is true for this 'id', show the complete 'description_en'.
                                            recipe.description_en :  
                                            // Else, show the substring of 'description_en', limited to 50 characters, followed by ellipses.
                                            `${recipe.description_en.substring(0, 50)}...`  
                                        }  
                                        {/* // Button to toggle the text expansion for 'description_en'. */}
                                        <button   
                                            onClick={() => toggleExpandText(recipe.id)}  
                                            className="text-blue-500 ml-2"  
                                        >  
                                            {/* // Ternary operator to display 'Less' if the text is expanded, otherwise 'More'. */}
                                            {expandedText[recipe.id] ? 'Less' : 'More'}  
                                        </button>  
                                    </td>                  
                                    {/* // Cell to display the 'total_calories' of the recipe. */}
                                    <td className="py-2 px-4 border-b border-gray-200 text-left">{recipe.total_calories}</td>  
                                    {/* // Cell to display the 'ingredients_en' (Ingredients in English) of the recipe. */}
                                    <td className="py-2 px-4 border-b border-gray-200 text-left">  
                                        {/* // Similar to 'description_en', a ternary operator to check whether to expand text or not. */}
                                        {expandedText[recipe.id] ?   
                                            // If true, display the complete 'ingredients_en'.
                                            recipe.ingredients_en :  
                                            // Otherwise, display a substring of 'ingredients_en' limited to 50 characters, followed by ellipses.
                                            `${recipe.ingredients_en.substring(0, 50)}...`  
                                        }  
                                        {/* // Button to toggle the text expansion for 'ingredients_en'. */}
                                        <button   
                                            onClick={() => toggleExpandText(recipe.id)}  
                                            className="text-blue-500 ml-2"  
                                        >  
                                            {/* // Display 'Less' if text is expanded, otherwise 'More'. */}
                                            {expandedText[recipe.id] ? 'Less' : 'More'}  
                                        </button>  
                                    </td>                  
                                    {/* // Cell to display the 'updated_at' date of the recipe. */}
                                    <td className="py-2 px-4 border-b border-gray-200 text-left">{new Date(recipe.updated_at).toLocaleDateString()}</td>  
                                    {/* // Cell for action buttons (View, Edit, Delete). */}
                                    <td className="py-2 px-4 border-b border-gray-200 text-center">  
                                        {/* // Link to navigate to the individual recipe's view page. */}
                                        <Link to={`/recipe/${recipe.id}`} className="text-blue-500 mr-3">View</Link>  
                                        {/* // Button to navigate to the edit page for the recipe. The state is passed to pre-fill form fields. */}
                                        <button onClick={() => {  
                                            navigate(`/edit-recipe/${recipe.id}`, { state: { recipe: recipe } });  
                                        }} className="text-yellow-500 mr-3">  
                                            Edit  
                                        </button>  
                                        {/* // Button to delete the recipe. It triggers the 'handleDeleteRecipe' function. */}
                                        <button onClick={() => handleDeleteRecipe(recipe.id)} className="text-red-500">  
                                            Delete  
                                        </button>  
                                    </td>  
                                </tr>  
                            ))}  
                        </tbody>  
                    </table>  
                )}  
                {/* // Incorporating the PaginationComponent to handle pagination. */}
                <PaginationComponent 
                    // Pass the current page number to the pagination component.
                    currentPage={currentPage} 
                    // Pass the total number of pages to the pagination component.
                    totalPages={totalPages} 
                    // Pass a function to change the current page when a different page is clicked.
                    onPageChange={setCurrentPage} 
                />
                {/* // Closing div for the container that holds the main content. */}
            </div>  
        </div>  // Closing div for the container that sets the background and padding.
    );  // End of the return statement for the JSX.

    // Export the RecipeListComponent so that it can be used in other parts of the application.
}  // End of the RecipeListComponent function.
export default RecipeListComponent;

// End of the file.
