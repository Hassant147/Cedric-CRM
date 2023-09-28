// Import the mongoose library, which provides tools for working with MongoDB.
const mongoose = require('mongoose');

// Define the schema for an ingredient using mongoose's Schema constructor.
// This schema will later be embedded within the recipeSchema.
const ingredientSchema = new mongoose.Schema({
    // The name of the ingredient, represented as a string.
    name: String,
    // The quantity of the ingredient, represented as a string.
    quantity: String,
    // The fats content of the ingredient, represented as a string.
    fats: String,
    // The caloric content (kcal) of the ingredient, represented as a string.
    kcal: Number, // The protein content of the ingredient, represented as a string.
    proteins: String,
    // The carbohydrate content of the ingredient, represented as a string.
    carbs: String
});

// Define the schema for a recipe using mongoose's Schema constructor.
const recipeSchema = new mongoose.Schema({
    // The title of the recipe, represented as a string.
    title: String,
    // A brief description of the recipe, represented as a string.
    description: String,
    // The cooking instructions for the recipe, represented as an array of strings.
    instructions: [String],
    // A URL pointing to an image of the finished dish, represented as a string.
    imageURL: String,
    // The food preference category of the recipe.
    foodPreference: {
        // It is of type string.
        type: String,
        // It can only take one of the following values: regular, pescatarian, vegetarian, or vegan.
        enum: ["regular", "pescatarian", "vegetarian", "vegan"],
        // This field is mandatory for every recipe document.
        required: true
    },
    // The type/category of the recipe (e.g., dessert, main course), represented as a string.
    recipeType: String,
    // Information about whether the recipe is free of common allergens, represented as a string.
    allergenFree: String,
    // The date the recipe was created. If not provided, it defaults to the current date and time.
    creationDate: { type: Date, default: Date.now },
    // The date the recipe was last updated. If not provided, it defaults to the current date and time.
    lastUpdatedDate: { type: Date, default: Date.now },
    // An array of ingredients, each ingredient adhering to the ingredientSchema defined above.
    ingredients: [ingredientSchema]
});

// Export a Mongoose model named 'Recipe', which will use the recipeSchema to interact with the 'recipes' collection in MongoDB.
module.exports = mongoose.model('Recipe', recipeSchema);