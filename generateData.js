const { faker } = require('@faker-js/faker');
const { sequelize, Recipe } = require('./models/index');


function generateRandomRecipe(id) {
    return {
        name_en: faker.commerce.productName().substring(0, 50),
        name_sv: faker.commerce.productName().substring(0, 50),
        minutes: Math.floor(Math.random() * 181),
        contributor_id: faker.number.int({ min: 1, max: 2147483647 }),
        submitted: faker.date.past(),
        tags_en: faker.lorem.words(5).substring(0, 100), // Max 100 characters
        tags_sv: faker.lorem.words(5).substring(0, 100),
        nutrition: faker.lorem.sentence().substring(0, 100), // Max 100 characters
        total_calories: faker.number.int({ min: 0, max: 5000 }),
        n_steps: faker.number.int({ min: 1, max: 50 }),
        steps_en: faker.lorem.sentences(3).substring(0, 500), // Max 500 characters
        steps_sv: faker.lorem.sentences(3).substring(0, 500),
        description_en: faker.lorem.paragraph().substring(0, 200), // Max 200 characters
        description_sv: faker.lorem.paragraph().substring(0, 200),
        ingredients_en: faker.lorem.words(10).substring(0, 100), // Max 100 characters
        ingredients_sv: faker.lorem.words(10).substring(0, 100),
        n_ingredients: faker.number.int({ min: 1, max: 50 }),
        thumbnail: faker.image.urlLoremFlickr(640, 480, 'food'),
        thumbnail_path: faker.system.filePath().substring(0, 100),
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
