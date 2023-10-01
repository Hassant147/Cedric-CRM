// Import the 'express' module to create the router
const express = require('express');

// Import the database models from '../models'
const db = require('../models');

// Destructure Recipe model from 'db'
const Recipe = db.Recipe;

// Import the 'Op' object from 'sequelize' for complex query operations
const { Op } = require('sequelize');

// Initialize an Express Router instance
const router = express.Router();

// Define an endpoint to fetch all recipes with optional filtering, sorting, and pagination
router.get('/', async(req, res) => {
    try {
        // Define valid fields for sorting and their directions
        const validSortFields = ['name_en', 'total_calories', 'updated_at'];
        const validSortDirections = ['ASC', 'DESC'];

        // Destructure query parameters from the request
        const { search, limit, offset, sortField, sortDirection, foodpreference, tags } = req.query;

        // Parse 'limit' and 'offset' to integers
        const parsedLimit = parseInt(limit, 10);
        const parsedOffset = parseInt(offset, 10);

        // Validate the parsed numbers or set default values
        const finalLimit = isNaN(parsedLimit) ? 10 : parsedLimit;
        const finalOffset = isNaN(parsedOffset) ? 0 : parsedOffset;

        // Initialize the 'where' clause for filtering
        let whereClause = {};
        if (search) {
            whereClause = {
                [Op.or]: [
                    { name_en: { [Op.like]: `%${search}%` } },
                    { ingredients_en: { [Op.like]: `%${search}%` } },
                    { id: search }
                ]
            };
        }

        // Add food preference and tags to 'where' clause if present
        if (foodpreference) whereClause.foodpreference = foodpreference;
        if (tags) whereClause.tags_en = { [Op.like]: `%${tags}%` };

        // Initialize the 'order' clause for sorting
        let orderClause = [];
        if (sortField && validSortFields.includes(sortField) && sortDirection && validSortDirections.includes(sortDirection)) {
            orderClause.push([sortField, sortDirection]);
        }

        // Fetch recipes based on the constructed queries
        const recipes = await Recipe.findAll({ 
            where: whereClause, 
            order: orderClause, 
            limit: finalLimit,
            offset: finalOffset
        });

        // Get the total count of recipes for the current query
        const totalCount = await Recipe.count({ where: whereClause });

        // Send a 200 OK response with the recipes and total count
        res.status(200).json({
            recipes: recipes,
            totalCount: totalCount
        });
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        console.error("Error while fetching recipes:", error);
        res.status(500).json({ message: "Error fetching recipes.", error: error.message });
    }
});

// Define an endpoint to fetch all available food preferences
router.get('/available-preferences', (req, res) => {
    const availablePreferences = ["vegan", "vegetarian", "pescatarian", "regular"];
    res.status(200).json(availablePreferences);
});

// Define an endpoint to add a new recipe
router.post('/', async(req, res) => {
    try {
        // Check for the 'created_at' field and set it if not provided
        if(!req.body.created_at || req.body.created_at === '') {
            req.body.created_at = new Date().toISOString();
        }

        // Create the new recipe and send a 201 Created response
        const newRecipe = await Recipe.create(req.body);
        res.status(201).json(newRecipe);
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        console.error("Error details: ", error);
        res.status(500).json({ message: "Error adding recipe.", error: error.message });
    }
});

// Define an endpoint to fetch a specific recipe by its ID
router.get('/:recipeId', async(req, res) => {
    try {
        // Fetch the recipe using its ID
        const recipe = await Recipe.findByPk(req.params.recipeId);
        // Check if the recipe exists and send a 404 Not Found response if not
        if (!recipe) return res.status(404).json({ message: "Recipe not found." });
        // Send a 200 OK response with the fetched recipe
        res.status(200).json(recipe);
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        res.status(500).json({ message: "Error fetching recipe.", error: error.message });
    }
});

// Define an endpoint to update a specific recipe by its ID
router.put('/:recipeId', async(req, res) => {
    try {
        // Update the recipe using its ID
        const updatedRows = await Recipe.update(req.body, { where: { id: req.params.recipeId } });
        // Check if the recipe exists and send a 404 Not Found response if not
        if (updatedRows[0] === 0) return res.status(404).json({ message: "Recipe not found." });
        // Send a 200 OK response indicating the recipe was updated
        res.status(200).json({ message: "Recipe updated successfully." });
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        res.status(500).json({ message: "Error updating recipe.", error: error.message });
    }
});

// Define an endpoint to delete a specific recipe by its ID
router.delete('/:recipeId', async(req, res) => {
    try {
        // Delete the recipe using its ID
        const deletedRows = await Recipe.destroy({ where: { id: req.params.recipeId } });
        // Check if the recipe exists and send a 404 Not Found response if not
        if (deletedRows === 0) return res.status(404).json({ message: "Recipe not found." });
        // Send a 200 OK response indicating the recipe was deleted
        res.status(200).json({ message: "Recipe deleted successfully." });
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        res.status(500).json({ message: "Error deleting recipe.", error: error.message });
    }
});

// Define an endpoint to fetch unique food preferences (tags) from the recipes table
router.get('/preferences', async(req, res) => {
    try {
        // Fetch unique tags from the 'tags_en' column
        const tags_en = await Recipe.findAll({
            attributes: ['tags_en'],
            group: ['tags_en']
        });

        // Create a set of unique tags
        const uniqueTags = [...new Set(tags_en.map(item => item.tags_en))];
        // Send a 200 OK response with the unique tags
        res.status(200).json(uniqueTags);
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        res.status(500).json({ message: "Error fetching food preferences.", error: error.message });
    }
});

// Define an endpoint to fetch categories based on food preference
router.get('/categories/:preference', async(req, res) => {
    try {
        // Destructure 'preference' from request params
        const preference = req.params.preference;

        // Fetch categories based on preference
        const categories = await Recipe.findAll({
            attributes: ['tags_en'],
            where: {
                tags_en: {
                    [Op.like]: `%${preference}%`
                }
            },
            group: ['tags_en']
        });

        // Create a set of unique categories
        const uniqueCategories = [...new Set(categories.map(item => item.tags_en))];
        // Send a 200 OK response with the unique categories
        res.status(200).json(uniqueCategories);
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        res.status(500).json({ message: "Error fetching recipe categories.", error: error.message });
    }
});

// Export the router to be mounted in the main app
module.exports = router;
