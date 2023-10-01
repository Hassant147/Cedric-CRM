// Importing necessary modules and components
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PaginationComponent from './PaginationComponent';
import Breadcrumb from './Breadcrumb.js';

// RecipeListComponent function component
function RecipeListComponent() {
    // Using the useNavigate hook for navigation purposes
    const navigate = useNavigate();

    // Using the useParams hook to get preference and category from the URL parameters
    const { preference, category } = useParams();

    // Sorting state variables
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');

    // Function to navigate to the edit recipe page
    const handleEdit = (recipeId) => {
        navigate(`/edit-recipe/${recipeId}`);
    };

    // Function to fetch recipes
    const fetchRecipes = async() => {
        try {
            const response = await fetch(`http://localhost:5100/api/recipes?foodPreference=${preference}&recipeType=${category}&page=${currentPage}&search=${searchTerm}&sortField=${sortField}&sortDirection=${sortDirection}`);
            const data = await response.json();

            setTotalRecipes(data.total);

            // Indexing recipes for search
            const indexedData = data.data.map(recipe => ({
                ...recipe,
                searchIndex: [
                    recipe.title,
                    recipe.description,
                    ...recipe.ingredients.map(ing => ing.name),
                    recipe.imageURL,
                    recipe.foodPreference,
                    recipe.allergenFree,
                    ...recipe.instructions
                ].join(' ').toLowerCase()
            }));
            setIndexedRecipes(indexedData);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };

    // Function to handle the deletion of a recipe
    const handleDelete = async(recipeId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:5100/api/recipes/${recipeId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    // After deletion, fetch the recipes again
                    fetchRecipes();
                } else {
                    console.error('Error deleting the recipe.');
                }
            } catch (error) {
                console.error('Failed to delete the recipe:', error);
            }
        }
    };

    // Function to toggle sorting direction or change sort field
    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };


    // useState hooks for indexed recipes, total recipes count, current page, and search term
    const [indexedRecipes, setIndexedRecipes] = useState([]);
    const [totalRecipes, setTotalRecipes] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Function to handle search input changes
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to the first page
    };

    // useEffect hook to fetch recipes whenever preference, category, or currentPage changes
    useEffect(() => {
        fetchRecipes();
    }, [preference, category, currentPage, sortField, sortDirection]);

    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalRecipes / itemsPerPage);
    // Filtering recipes based on search term
    const displayedRecipes = indexedRecipes;

    console.log(displayedRecipes);

    // New useEffect hook to fetch recipes whenever searchTerm changes
    useEffect(() => {
        setCurrentPage(1);
        fetchRecipes();
    }, [searchTerm]);
    // Rendering the component JSX
    return ( <
            div className = "bg-light-gray p-8" >
            <
            div className = "bg-light-gray p-8" >
            <
            Breadcrumb crumbs = {
                [
                    { path: "/", label: "Home" },
                    { path: `/recipes/${category}/${preference}`, label: `${preference}` },
                    { path: `/recipes/${category}`, label: `${category}` },
                    { path: "/recipes", label: "Recipes" },

                ]
            }
            /> <
            /div> <
            h1 className = "text-3xl font-bold mb-6" > Recipes
            for { category }({ preference }) < /h1> <
            div className = "mb-4" >
            <
            input type = "text"
            placeholder = "Search recipes..."
            value = { searchTerm }
            onChange = { handleSearch }
            className = "border p-2 rounded w-full mb-4" /
            >
            <
            /div> <
            table className = "min-w-full divide-y divide-gray-200" > { /* Table header */ } <
            thead >
            <
            tr > { /* Columns headers with sorting capabilities */ } <
            th className = "px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick = {
                () => toggleSort('title') } >
            Title <
            /th> <
            th className = "px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" > Method < /th> <
            th className = "px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick = {
                () => toggleSort('date') } >
            Date Modified <
            /th> <
            th className = "px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick = {
                () => toggleSort('calories') } >
            Calories <
            /th> <
            th className = "px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" > Ingredients < /th> <
            th className = "px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" > Actions < /th> <
            /tr> <
            /thead> { /* Table body */ } <
            tbody > { /* Rendering each recipe in its own row */ } {
                displayedRecipes.map((recipe) => ( <
                        tr key = { recipe._id }
                        className = "bg-white border-t border-gray-200" >
                        <
                        td className = "px-6 py-4" > { recipe.title } < /td> <
                        td className = "px-6 py-4" >
                        <
                        details >
                        <
                        summary > Instructions < /summary> <
                        p > { recipe.instructions.join(', ') } < /p> <
                        /details> <
                        /td> <
                        td className = "px-6 py-4" > { new Date(recipe.lastUpdatedDate).toLocaleDateString() } < /td> <
                        td className = "px-6 py-4" > {
                            recipe.ingredients.reduce((sum, ingredient) => sum + ingredient.kcal, 0) + " kcal"
                        } <
                        /td> <
                        td className = "px-6 py-4" >
                        <
                        details >
                        <
                        summary > Ingredients < /summary> <
                        ul > {
                            recipe.ingredients.map((ing, index) => < li key = { `${recipe._id}-${ing.name}-${index}` } > { ing.name } < /li>)} <
                                /ul> <
                                /details> <
                                /td>

                                <
                                td className = "px-6 py-4" > { /* Action links for each recipe */ } <
                                Link to = { `/recipe/${recipe._id}` }
                                className = "text-blue-500 hover:underline mr-2" >
                                View <
                                /Link> <
                                button onClick = {
                                    () => handleEdit(recipe._id) }
                                className = "text-yellow-500 hover:underline mr-2" >
                                Edit <
                                /button> <
                                button onClick = {
                                    () => handleDelete(recipe._id) }
                                className = "text-red-500 hover:underline" >
                                Delete <
                                /button> <
                                /td> <
                                /tr>
                            ))
                    } <
                    /tbody> <
                    /table> { /* Pagination component */ } <
                    div className = "mt-4" >
                    <
                    PaginationComponent totalPages = { totalPages }
                    currentPage = { currentPage }
                    onPageChange = { setCurrentPage }
                    /> <
                    /div> { /* Navigation buttons */ } <
                    div className = "flex space-x-4 mt-12" >
                    <
                    button onClick = {
                        () => navigate(-1) }
                    className = "px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition duration-300 ease-in-out" >
                    Back <
                    /button> <
                    Link to = {
                        {
                            pathname: "/add-recipe",
                            state: { defaultPreference: preference, defaultCategory: category }
                        }
                    }
                    className = "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 ease-in-out" >
                    Add Recipe <
                    /Link> <
                    /div> <
                    /div>
                );
            }

            // Exporting the RecipeListComponent for use in other parts of the application
            export default RecipeListComponent;