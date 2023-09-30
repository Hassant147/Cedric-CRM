const { faker } = require('@faker-js/faker');
const { sequelize, Recipe } = require('./models/index');


function generateRandomRecipe(id) {
    return {
        name_en: faker.commerce.productName(),
        name_sv: faker.commerce.productName(),
        minutes: Math.floor(Math.random() * 181), // Random number between 0 and 180
        contributor_id: faker.number.int({ min: 1, max: 2147483647 }),
        submitted: faker.date.past(),
        tags_en: faker.lorem.words(),
        tags_sv: faker.lorem.words(),
        nutrition: faker.lorem.sentence(),
        total_calories: faker.number.int({ min: 0, max: 5000 }), // Assuming a max of 5000 calories
        n_steps: faker.number.int({ min: 1, max: 50 }), // Assuming a max of 50 steps
        steps_en: faker.lorem.sentences(),
        steps_sv: faker.lorem.sentences(),
        description_en: faker.lorem.paragraph(),
        description_sv: faker.lorem.paragraph(),
        ingredients_en: faker.lorem.words(),
        ingredients_sv: faker.lorem.words(),
        n_ingredients: faker.number.int({ min: 1, max: 50 }), // Assuming a max of 50 ingredients
        thumbnail: faker.image.urlLoremFlickr({ category: 'food' }),
        thumbnail_path: faker.system.filePath(),
        defaulted_image: faker.datatype.boolean(),
        created_at: faker.date.past(),
        updated_at: faker.date.recent(),
        deleted_at: faker.datatype.boolean() ? null : faker.date.recent(),
        foodpreference: ["vegan", "vegetarian", "pescatarian", "regular"][Math.floor(Math.random() * 4)]
    };
}


async function insertRandomRecipes() {
    try {
        await sequelize.authenticate();
        console.log("Connected to MySQL");

        const numberOfRecipes = 10000;  // or however many you want
        const randomRecipes = Array.from({ length: numberOfRecipes }, (_, i) => generateRandomRecipe(i + 1));
        await Recipe.bulkCreate(randomRecipes);
        
        console.log("Inserted random recipes into the database");
    } catch (error) {
        console.error("Error inserting data into MySQL:", error);
    } finally {
        await sequelize.close();
    }
}

insertRandomRecipes();
