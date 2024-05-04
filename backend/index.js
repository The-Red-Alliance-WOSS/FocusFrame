const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const cors = require('cors');
const User = require('./models/User'); // Assuming your User model is in a separate file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// CORS middleware
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Use Discord Strategy for authentication
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify', 'email'], // Moved scope here
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ discordId: profile.id });
    if (!user) {
      const newUser = new User({
        discordId: profile.id,
        tasks: [], // Initialize tasks array for new user
      });
      await newUser.save();
      return done(null, newUser);
    } else {
      return done(null, user);
    }
  } catch (err) {
    console.error(err);
    return done(err);
  }
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Express middlewares
app.use(express.json());
app.use(session({
  secret: 'i<3eurekahacks2024',
  resave: false,
  saveUninitialized: false, // Set saveUninitialized to true to save uninitialized sessions
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
  successRedirect: 'http://localhost:5500/',
  failureRedirect: '/login',
}));

// Fix the Access-Control-Allow-Origin header
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://localhost:5501');
  next();
});

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Route to add a task for a user
app.get('/tasks/add', (req, res) => {
  if (req.isAuthenticated()) {
    const { task_name, close } = req.query; // Extract task_name and close from query parameters
    const userId = req.user._id; // Assuming user ID is stored in the session

    User.findById(userId, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Add task to user's tasks array
      user.tasks.push({ task_name, task_progress: false });

      // Save user document
      user.save((err, updatedUser) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }

        // If close parameter is provided, send response immediately
        if (close === 'true') {
          const responseHtml = `
            <script>
              window.close(); // Close the current tab
            </script>`;
          return res.json(updatedUser);
        }
      });

      // If close parameter is not provided, wait for the save operation to complete
      if (close !== 'true') {
        res.json({ message: 'Task added successfully' });
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});


// Route to modify a task for a user
app.put('/tasks/:taskId', (req, res) => {
  if (req.isAuthenticated()) {
    const { taskId } = req.params; // Extract taskId from URL parameters
    const { task_progress } = req.body; // Extract task_progress from request body
    const userId = req.user._id; // Assuming user ID is stored in the session

    User.findById(userId, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find the task by its ID
      const task = user.tasks.find(task => task._id === taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Update task_progress if provided
      if (task_progress !== undefined) {
        task.task_progress = task_progress;
      }

      // Save user document
      user.save((err, updatedUser) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(updatedUser);
      });
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Route to delete a task for a user
app.delete('/tasks/:taskId', (req, res) => {
  if (req.isAuthenticated()) {
    const { taskId } = req.params; // Extract taskId from URL parameters
    const userId = req.user._id; // Assuming user ID is stored in the session

    User.findById(userId, (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Find the index of the task in the tasks array
      const taskIndex = user.tasks.findIndex(task => task._id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }

      // Remove the task from the tasks array
      user.tasks.splice(taskIndex, 1);

      // Save user document
      user.save((err, updatedUser) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        res.json(updatedUser);
      });
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
