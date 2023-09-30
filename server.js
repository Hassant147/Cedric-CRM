const express = require('express');
const cors = require('cors');
const db = require('./models');
const Recipe = db.Recipe;
const recipes = require('./routes/recipes'); // Ensure path to the recipes route file

// Sequelize setup
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('cedric-crm', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});
sequelize.authenticate()
    .then(() => {
        console.log('Connection to the database has been established successfully.');
        
        // Synchronize the Recipe model with the database
        db.sequelize.sync({ force: false })
        .then(() => {
                console.log("raw_recipes table has been successfully created, if one doesn't exist");
            })
            .catch(error => {
                console.log("Error occurred during the synchronization:", error);
            });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


// Test the connection
sequelize.authenticate()
    .then(() => console.log('Connected to the MySQL database.'))
    .catch(err => console.error('Unable to connect to the MySQL database:', err));

// Create an instance of Express application
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/recipes', recipes);

// Starting the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});