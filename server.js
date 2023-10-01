// Import necessary modules from the Node.js, Express, Mongoose, and CORS libraries.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize an instance of an Express application.
const app = express();

// Import the recipe-related routes from the 'routes' directory.
const recipeRoutes = require('./routes/recipes');

// Middleware setup
// The following line sets up a middleware to parse incoming JSON payloads in the request body.
app.use(express.json());
// The following line sets up the CORS middleware to handle Cross-Origin Resource Sharing, allowing client-side applications from different origins to communicate with this backend.
app.use(cors());

// Connect to a local MongoDB instance. The specific database is 'cedric-crm'.
mongoose.connect('mongodb://localhost:27017/cedric-crm', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        // Log a success message once connected to the MongoDB instance.
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        // In case of connection failure, log an error message.
        console.error("Error connecting to MongoDB:", err);
    });

// Define a test route for the root path which confirms the backend is running.
app.get('/', (req, res) => {
    res.send('Cedric CRM Backend is running');
});

// Define another test route to ensure the backend is operational and returns a JSON response.
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is connected!" });
});

// Register the imported recipe routes under the '/api/recipes' path.
app.use('/api/recipes', recipeRoutes);

// Define the port number on which the Express server will listen.
const PORT = 5100;
// Start the Express server and log a message indicating its running status and address.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});