
// module.exports = server;
const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS middleware for cross-origin requests
const helmet = require("helmet"); // Import Helmet middleware for security headers

const restrict = require("./middleware/restricted.js"); // Import the restricted middleware for protected routes

const authRouter = require("./auth/auth-router.js"); // Import the auth-router for authentication routes
const jokesRouter = require("./jokes/jokes-router.js"); // Import the jokes-router for jokes-related routes

const server = express(); // Initialize the Express server

// Middleware
server.use(helmet()); // Use Helmet for security headers
server.use(cors()); // Use CORS to handle cross-origin requests
server.use(express.json()); // Use Express's built-in middleware to parse incoming JSON requests

// Routes
server.use("/api/auth", authRouter); // Use the authRouter for authentication-related routes
server.use("/api/jokes", restrict, jokesRouter); // Use the restrict middleware for protected routes and the jokesRouter for jokes-related routes

// Health Check Endpoint
server.get("/", (req, res) => {
  res.json({ message: "Server is up and running!" }); // Respond with a message indicating the server is running
});

// Error Handling Middleware
server.use((err, req, res, next) => { // eslint-disable-line
  console.error(err); // Log the error for debugging
  res.status(500).json({
    message: "Something went wrong. Please try again later.", // Send a generic error message to the client
  });
});

module.exports = server; // Export the server to be used in other parts of the app