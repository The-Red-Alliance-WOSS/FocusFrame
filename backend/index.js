const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const User = require('./models/User'); // Assuming your User model is in a separate file
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

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
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ discordId: profile.id }, (err, user) => {
    if (err) return done(err);
    if (!user) {
      const newUser = new User({
        discordId: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        tasks: [], // Initialize tasks array for new user
      });
      newUser.save((err) => {
        if (err) console.error(err);
        return done(null, newUser);
      });
    } else {
      return done(null, user);
    }
  });
}));

// Express middlewares
app.use(express.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
  res.send('Home Page');
});

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

// Route to add a task for a user
app.post('/tasks/add', (req, res) => {
  if (req.isAuthenticated()) {
    const { task_name } = req.body;
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
