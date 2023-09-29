const { DataTypes, Sequelize } = require('sequelize');
// Initialize the Sequelize instance with your database credentials
const sequelize = new Sequelize('cedric-crm', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const Recipe = sequelize.define('Recipe', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },    
    name_en: DataTypes.STRING,
    name_sv: DataTypes.STRING,
    minutes: DataTypes.INTEGER,
    contributor_id: DataTypes.INTEGER,
    submitted: DataTypes.STRING,
    tags_en: DataTypes.TEXT,
    tags_sv: DataTypes.TEXT,
    nutrition: DataTypes.TEXT,
    total_calories: DataTypes.INTEGER,
    n_steps: DataTypes.INTEGER,
    steps_en: DataTypes.TEXT,
    steps_sv: DataTypes.TEXT,
    description_en: DataTypes.TEXT,
    description_sv: DataTypes.STRING,
    ingredients_en: DataTypes.TEXT,
    ingredients_sv: DataTypes.STRING,
    n_ingredients: DataTypes.INTEGER,
    thumbnail: DataTypes.TEXT,
    thumbnail_path: DataTypes.STRING,
    defaulted_image: DataTypes.BOOLEAN,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE,
    foodpreference: DataTypes.STRING
}, {
    tableName: 'raw_recipes',
    timestamps: false
});

module.exports = Recipe;
