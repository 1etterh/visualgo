const express = require('express');
const router = express.Router();
const db = require('../database/database.js');
require('dotenv').config();
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MySQLStore = require('express-mysql-session')(session);

// Session store configuration
const sessionStore = new MySQLStore({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: 'credentials'
});

// Session middleware
router.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}));

sessionStore.onReady().then(() => {
    console.log('MySQL Session store is ready');
}).catch((err) => {
    console.error('Session store initialization failed:', err);
});

// Initialize passport
router.use(passport.initialize());
router.use(passport.session());

// Passport local strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  console.log('local strategy');
    db.query('SELECT * FROM credentials.user WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return done(err);
        }
        if (!results.length) {
            return done(null, false, { message: 'Invalid username' });
        }
        const user = results[0];
        await bcrypt.compare(password, user.password, async(err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
              console.log(user.password);
              const h = await bcrypt.hash(password,10);
              console.log(h)
                return done(null, false, { message: 'Wrong password' });
            }
            return done(null, user);
        });
    });
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  console.log("Serialize user");
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("passport.deserializeUser");
    db.query('SELECT * FROM credentials.user WHERE id = ?', [id], (err, results) => {
        if (err) {
            return done(err);
        }
        if (!results.length) {
            return done(null, false);
        }
        const user = results[0];
        return done(null, user);
    });
});

// Login route
router.post('/login', async (req, res, next) => {
  console.log('Login request received:', req.body); // 요청 본문 로그
  passport.authenticate('local', (error, user, info) => {
    console.log('Passport authentication result:', { error, user, info }); // Passport 인증 결과 로그
    if (error) return res.status(500).json({ message: 'Internal server error' });
    if (!user) return res.status(401).json({ message: info.message });
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ success: true });
    });
  })(req, res, next);
});


// Check username route
router.post('/checkUsername', async (req, res) => {
  const { username } = req.body;
  try {
    const sql = 'SELECT * FROM credentials.user WHERE username = ?';
    const results = await db.query(sql, [username]);
    if (results.length > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error occurred while checking username:', err);
    res.status(500).json({ message: 'Error occurred while checking username' });
  }
});


// Register route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hash = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO credentials.user (username, password) VALUES (?, ?)';
        await db.query(sql, [username, hash]);
        res.json({ success: true });
    } catch (err) {
        console.error('Error occurred during registration:', err);
        res.status(500).json({ message: 'Error occurred during registration' });
    }
});

// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // User is authenticated, proceed to the next middleware
    }
    // User is not authenticated, send an error response
    return res.status(401).json({ message: 'Unauthorized' });
}

// Export the router
module.exports = router;
