const express = require('express');
const db = require('../models');
const Recipe = db.Recipe;
const { Op } = require('sequelize');
const router = express.Router();

// Fetch all recipes with optional filtering, sorting, and pagination
router.get('/', async(req, res) => {
    
    try {
        const validSortFields = ['name_en', 'total_calories', 'updated_at'];
        const validSortDirections = ['ASC', 'DESC'];
        const { search, limit, offset, sortField, sortDirection, foodpreference, tags } = req.query;

        // Parse limit and offset to integers
        const parsedLimit = parseInt(limit, 10);
        const parsedOffset = parseInt(offset, 10);

        // Check if they are valid numbers, otherwise set default values
        const finalLimit = isNaN(parsedLimit) ? 10 : parsedLimit;  // default to 10 if not a valid number
        const finalOffset = isNaN(parsedOffset) ? 0 : parsedOffset;  // default to 0 if not a valid number


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
        if (foodpreference) whereClause.foodpreference = foodpreference;
        if (tags) whereClause.tags_en = { [Op.like]: `%${tags}%` };

            // Existing code            
            let orderClause = [];
            if (sortField && validSortFields.includes(sortField) && sortDirection && validSortDirections.includes(sortDirection)) {
                orderClause.push([sortField, sortDirection]);
            }

        const recipes = await Recipe.findAll({ 
            where: whereClause, 
            order: orderClause, 
            limit: finalLimit,
            offset: finalOffset
        });
                
         // Get the total count of recipes that fit the current query
         const totalCount = await Recipe.count({ where: whereClause });

         // Return both the paginated recipes and the total count
         res.status(200).json({
             recipes: recipes,
             totalCount: totalCount
         });
    } catch (error) {
        console.error("Error while fetching recipes:", error);
        res.status(500).json({ message: "Error fetching recipes.", error: error.message });
    }
});

router.get('/available-preferences', (req, res) => {
    const availablePreferences = ["vegan", "vegetarian", "pescatarian", "regular"];
    res.status(200).json(availablePreferences);
});


// Add a new recipe
router.post('/', async(req, res) => {
    try {
        // Check and set the 'created_at' field if not provided
        if(!req.body.created_at || req.body.created_at === '') {
            req.body.created_at = new Date().toISOString();
        }

          // Continue with creating the new recipe
          const newRecipe = await Recipe.create(req.body);
          res.status(201).json(newRecipe);
      } catch (error) {
          console.error("Error details: ", error); // Log the entire error object
          res.status(500).json({ message: "Error adding recipe.", error: error.message });
      }
  });


// Fetch a specific recipe by its ID
router.get('/:recipeId', async(req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found." });
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipe.", error: error.message });
    }
});

// Update a specific recipe by its ID
router.put('/:recipeId', async(req, res) => {
    try {
        const updatedRows = await Recipe.update(req.body, { where: { id: req.params.recipeId } });
        if (updatedRows[0] === 0) return res.status(404).json({ message: "Recipe not found." });
        res.status(200).json({ message: "Recipe updated successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error updating recipe.", error: error.message });
    }
});

// Delete a specific recipe by its ID
router.delete('/:recipeId', async(req, res) => {
    try {
        const deletedRows = await Recipe.destroy({ where: { id: req.params.recipeId } });
        if (deletedRows === 0) return res.status(404).json({ message: "Recipe not found." });
        res.status(200).json({ message: "Recipe deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error deleting recipe.", error: error.message });
    }
});
// Fetch unique food preferences (tags) from the raw_recipes table
router.get('/preferences', async(req, res) => {
    try {
        const tags_en = await Recipe.findAll({
            attributes: ['tags_en'],
            group: ['tags_en']
        });

        const uniqueTags = [...new Set(tags_en.map(item => item.tags_en))];
        res.status(200).json(uniqueTags);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food preferences.", error: error.message });
    }
});

// For now, using tags_en as categories since no separate category column was provided in the schema.
router.get('/categories/:preference', async(req, res) => {
    try {
        const preference = req.params.preference;

        const categories = await Recipe.findAll({
            attributes: ['tags_en'],
            where: {
                tags_en: {
                    [Op.like]: `%${preference}%`
                }
            },
            group: ['tags_en']
        });

        const uniqueCategories = [...new Set(categories.map(item => item.tags_en))];
        res.status(200).json(uniqueCategories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipe categories.", error: error.message });
    }
});

module.exports = router;