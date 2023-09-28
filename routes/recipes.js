// Import necessary modules from the Node.js and Express libraries.
const express = require('express');
// Import the Recipe model that interacts with the MongoDB recipes collection.
const Recipe = require('../models/Recipe');

// Initialize an Express router to handle API endpoints.
const router = express.Router();

// Define an endpoint to retrieve all recipes.
// This endpoint supports filtering by foodPreference, recipeType, and search term in the title.
// Additionally, it supports pagination with default values for the page and limit.
router.get('/', async(req, res) => {
    try {
        const { foodPreference, recipeType, search, page = 1, limit = 10, sortField, sortDirection } = req.query;

        const matchQuery = {};
        if (foodPreference) matchQuery.foodPreference = foodPreference;
        if (recipeType) matchQuery.recipeType = recipeType;
        if (search) {
            matchQuery.$or = [
                { title: { $regex: search, $options: 'i' } },
                { "ingredients.name": { $regex: search, $options: 'i' } }
            ];
        }
        let sortQuery = {};
        if (sortField) {
            if (sortField === 'calories') {
                sortQuery.totalCalories = sortDirection === 'desc' ? -1 : 1;
            } else {
                sortQuery[sortField] = sortDirection === 'desc' ? -1 : 1;
            }
        }

        const aggregationPipeline = [
            { $match: matchQuery },
            {
                $addFields: {
                    totalCalories: { $sum: "$ingredients.kcal" }
                }
            },
            { $sort: sortQuery },
            { $skip: (page - 1) * limit },
            { $limit: limit * 1 }
        ];

        const recipes = await Recipe.aggregate(aggregationPipeline);

        const totalRecipes = await Recipe.countDocuments(matchQuery);

        res.json({ data: recipes, total: totalRecipes });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// Define an endpoint to retrieve a single recipe by its ID.
router.get('/:recipeId', async(req, res) => {
    try {
        // Fetch the recipe using its ID from the route parameters.
        const recipe = await Recipe.findById(req.params.recipeId);
        if (!recipe) {
            // If the recipe is not found, return a 404 status code.
            return res.status(404).json({ message: 'Recipe not found' });
        }
        // Return the retrieved recipe.
        res.json(recipe);
    } catch (error) {
        // In case of any error, return a 500 status code with the error message.
        res.status(500).json({ message: error.message });
    }
});

// Define an endpoint to add a new recipe.
router.post('/', async(req, res) => {
    try {
        // Create a new instance of the Recipe model with the request body.
        const newRecipe = new Recipe(req.body);
        // Save the new recipe to the database.
        const savedRecipe = await newRecipe.save();
        // Return the saved recipe.
        res.json(savedRecipe);
    } catch (error) {
        // If there's an error (like validation failure), return a 400 status code with the error message.
        res.status(400).json({ message: error.message });
    }
});

// Define an endpoint to update an existing recipe by its ID.
router.put('/:recipeId', async(req, res) => {
    try {
        // Update the recipe in the database using its ID and the request body.
        // The `{ new: true }` option returns the updated recipe.
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.recipeId, req.body, { new: true });
        if (!updatedRecipe) {
            // If the recipe is not found, return a 404 status code.
            return res.status(404).json({ message: 'Recipe not found' });
        }
        // Return the updated recipe.
        res.json(updatedRecipe);
    } catch (error) {
        // In case of any error, return a 500 status code with the error message.
        res.status(500).json({ message: error.message });
    }
});

// Define an endpoint to delete a recipe by its ID.
router.delete('/:recipeId', async(req, res) => {
    try {
        // Delete the recipe from the database using its ID.
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.recipeId);
        if (!deletedRecipe) {
            // If the recipe is not found, return a 404 status code.
            return res.status(404).json({ message: 'Recipe not found' });
        }
        // Confirm the deletion with a success message.
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        // In case of any error, return a 500 status code with the error message.
        res.status(500).json({ message: error.message });
    }
});

// Define an endpoint to retrieve distinct recipe categories based on the foodPreference.
router.get('/categories', async(req, res) => {
    try {
        // Extract the foodPreference from the query parameters.
        const foodPreference = req.query.foodPreference;
        // Fetch distinct recipe types/categories based on the provided foodPreference.
        const distinctCategories = await Recipe.distinct("recipeType", { foodPreference: foodPreference });
        // Return the list of distinct categories.
        res.json(distinctCategories);
    } catch (err) {
        // In case of any error, return a 500 status code with the error message.
        res.status(500).json({ message: err.message });
    }
});

// Export the configured router to be used in other parts of the application.
module.exports = router;