const mongoose = require('mongoose');

// STEP 1: HELPER FUNCTIONS AND RANDOM RECIPE GENERATOR

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomElement = array => array[getRandomInt(0, array.length - 1)];
const recipeTypes = ["Pasta", "Boiled Rice", "Salad", "Soup", "Dessert"];
const ingredientsList = [
    "Tomato", "Lettuce", "Chicken", "Pasta", "Rice", "Carrots", "Onions", "Garlic", "Beef", "Pork",
    "Lemon", "Cheese", "Bread", "Beans", "Peas", "Corn", "Mushrooms", "Spinach", "Tofu", "Shrimp",
    "Broccoli", "Cauliflower", "Brussels sprouts", "Potatoes", "Sweet potatoes", "Lamb", "Turkey",
    "Fish", "Clams", "Crab", "Lobster", "Mussels", "Octopus", "Oysters", "Scallops", "Squid",
    "Cabbage", "Celery", "Cucumber", "Eggplant", "Green beans", "Kale", "Leeks", "Bell peppers",
    "Hot peppers", "Radishes", "Turnips", "Zucchini", "Apples", "Bananas", "Cherries", "Grapes",
    "Oranges", "Strawberries", "Pears", "Peaches", "Pineapple", "Watermelon", "Blueberries",
    "Raspberries", "Blackberries", "Kiwi", "Mango", "Papaya", "Pomegranate", "Coconut", "Lime",
    "Nectarines", "Plums", "Rhubarb", "Apricots", "Figs", "Ginger", "Nuts", "Olives", "Quinoa",
    "Cranberries", "Dates", "Raisins", "Currants", "Dried apricots", "Sunflower seeds", "Pumpkin seeds",
    "Flax seeds", "Chia seeds", "Almonds", "Cashews", "Walnuts", "Pistachios", "Macadamia nuts",
    "Peanuts", "Pecans", "Hazelnuts", "Brazil nuts", "Pine nuts", "Chestnuts", "Hemp seeds",
    "Poppy seeds", "Sesame seeds", "Tahini", "Almond butter", "Peanut butter", "Cashew butter",
    "Sunflower seed butter", "Avocado", "Olives", "Coconut milk", "Almond milk", "Soy milk",
    "Rice milk", "Hemp milk", "Cashew milk", "Macadamia milk", "Oat milk", "Flax milk", "Pea milk"
];
const foodPreferences = ["regular", "pescatarian", "vegetarian", "vegan"];
const titles = [
    "Delicious", "Tasty", "Yummy", "Mouthwatering", "Savory", "Sweet", "Spicy", "Creamy",
    "Crunchy", "Juicy", "Hearty", "Light", "Fluffy", "Rich", "Decadent", "Smooth", "Tangy",
    "Zesty", "Sharp", "Sour", "Bitter", "Salty", "Smoky", "Fiery", "Hot", "Cool", "Crispy",
    "Toasty", "Silky", "Velvety", "Refreshing", "Caramelized", "Golden", "Fragrant", "Tender",
    "Crisp", "Soft", "Melt-in-the-mouth", "Airy", "Succulent", "Lush", "Perfectly cooked",
    "Wholesome", "Homestyle", "Moreish", "Toothsome", "Palatable", "Ambrosial", "Heavenly",
    "Lip-smacking", "Piquant", "Nutty", "Earthy", "Buttery", "Sizzling", "Marinated", "Glazed"
];

const descriptions = [
    "A classic dish", "Perfect for family gatherings", "You'll want seconds", "A comforting meal",
    "Tastes just like grandma's", "Perfect for a chilly day", "Refreshing and delightful",
    "A summer favorite", "Ideal for brunch", "A festive treat", "A culinary masterpiece",
    "A childhood favorite", "Great for picnics", "Perfect comfort food", "A dish to remember",
    "Bursting with flavors", "A tantalizing treat", "Aromatic and divine", "Wholesome goodness",
    "Melt in the mouth", "Creamy dreamy delicacy", "A tropical paradise", "Satisfies the soul",
    "Bursting with freshness", "A zingy treat", "A sweet temptation", "Spiced to perfection",
    "A tangy sensation", "Aromatic wonders", "A delightful mix", "A crunchy affair",
    "Golden fried perfection", "Rich and luscious", "A spicy kick", "Soothes the palate",
    "A nutty wonder", "Sugary delights", "Cheesy goodness", "Fluffy as a cloud", "Thick and rich",
    "Smooth and silky", "A chocolaty dream", "A velvety delight", "Crisp and tangy", "Sweet and sour magic",
    "A minty refreshment", "Juicy and succulent", "An icy treat", "Warm and comforting", "Light and breezy",
    "A fragrant affair", "Drenched in syrup", "Coated in goodness", "A fruity blast", "A citrus punch",
    "An earthy flavor", "A fiery delight", "Smoky and juicy", "Grilled to perfection", "Steamed wonders",
    "Rolled and stuffed", "Layered delights", "Dripping with cheese", "A crusty dream", "Soft and chewy",
    "Hot and steamy", "A bubbly treat", "A sprinkle of herbs", "A dash of spice", "A touch of sweetness",
    "A hint of bitterness", "Crumbly goodness", "A velvety texture", "A crispy bite", "A gooey center"
];
const instructionTemplates = [
    ["Start by preheating the oven to 350°F (175°C).", "In a large mixing bowl, combine ", "Pour the mixture into a baking dish.", "Bake for 30 minutes or until golden brown."],
    ["In a large pot, bring water to boil.", "Add ", "and cook until softened.", "Drain the water and set aside."],
    ["In a skillet over medium heat, melt some butter.", "Add ", "and sauté until fragrant.", "Turn off the heat and let it cool for a few minutes."],
    ["Begin by marinating ", "in a mixture of soy sauce, garlic, and lemon juice.", "Let it sit for at least 2 hours.", "Grill until fully cooked, turning occasionally."],
    ["Blend ", "in a food processor until smooth.", "Pour into a bowl and refrigerate for an hour before serving."],
    ["Mix ", "in a large bowl.", "Shape into patties or balls.", "Fry in a pan until all sides are golden brown."],
    ["Layer ", "in a dish.", "Cover with foil or a lid.", "Bake or steam until everything is fully cooked."],
    ["Spread a layer of sauce on a flat surface.", "Place ", "on top.", "Roll or wrap and secure with a toothpick."],
    ["Whisk ", "in a bowl until fully combined.", "Pour onto a preheated pan.", "Cook until bubbles form, then flip to cook the other side."],
    ["Combine ", "in a large salad bowl.", "Toss with your choice of dressing.", "Serve chilled."],
    ["Steep ", "in hot water for about 5 minutes.", "Strain out any solids.", "Serve in a cup with a slice of lemon."],
    ["Place ", "in a pot with enough water to cover.", "Simmer until everything is tender.", "Season with salt and pepper to taste."],
    ["Thread ", "onto skewers.", "Grill, turning occasionally, until charred and fully cooked.", "Serve with a dipping sauce on the side."],
    ["Mash ", "in a bowl until smooth.", "Season with salt, pepper, and a dash of cream.", "Serve as a side dish."],
    ["Fold ", "into a whipped mixture.", "Chill in the refrigerator for a few hours.", "Serve in individual glasses, topped with a sprinkle of cocoa powder."]
];

const generateRandomRecipe = () => {
    const ingredientCount = getRandomInt(2, 5);
    let ingredients = [];

    for (let i = 0; i < ingredientCount; i++) {
        ingredients.push({
            name: getRandomElement(ingredientsList),
            quantity: `${getRandomInt(1, 5)} cups`,
            fats: `${getRandomInt(0, 10)}g`,
            kcal: getRandomInt(10, 300),
            proteins: `${getRandomInt(0, 30)}g`,
            carbs: `${getRandomInt(0, 50)}g`
        });
    }

    const randomInstructions = getRandomElement(instructionTemplates);
    const ingredientsForInstructions = ingredients.map(ing => ing.name).slice(0, 2).join(" and ");
    const filledInstructions = randomInstructions.map(step => step.replace(' ', ingredientsForInstructions));

    return {
        title: `Delicious ${getRandomElement(ingredientsList)} Dish`,
        description: `This unique ${getRandomElement(ingredientsList)} dish is perfect for ${getRandomElement(["summer", "winter", "autumn", "spring"])}. Enjoy a taste of ${getRandomElement(["Italy", "Mexico", "India", "China", "France"])} with this recipe.`,
        instructions: filledInstructions,
        imageURL: `http://example.com/image.jpg`,
        foodPreference: getRandomElement(foodPreferences),
        recipeType: getRandomElement(recipeTypes),
        allergenFree: getRandomInt(0, 1) ? 'Yes' : 'No',
        ingredients: ingredients
    };
};


// Import the Recipe model
const Recipe = require('./models/Recipe').default; // Adjust the path if needed

mongoose.connect('mongodb://localhost:27017/cedric-crm', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(async() => {
        console.log("Connected to MongoDB");

        // STEP 2: GENERATE DATA AND INSERT INTO DATABASE
        try {
            const randomRecipes = Array.from({ length: 10000 }, (_, i) => generateRandomRecipe(i + 1));
            await Recipe.insertMany(randomRecipes);
            console.log("Inserted random recipes into the database");
        } catch (error) {
            console.error("Error inserting data into MongoDB:", error);
        }

        // Close the connection after inserting data
        mongoose.connection.close();
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });