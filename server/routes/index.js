const express = require('express')
const router=express.Router()
const db = require('./database/database.js')
require('dotenv').config()
const session = require('express-session')
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const MySQLStore = require('express-mysql-session')(session)
/* routes about account settings
 */
const options = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database:'credentials'
}

const sessionStore = new MySQLStore(options)
router.use(passport.initialize())
router.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    resave: false,
saveUninitialized: false,
store: sessionStore
}))

sessionStore.onReady().then(() => {
    console.log('MySQL Session store ready')})
    .catch((err) => {  console.log(err) } )   
    
    
router.use(passport.session())


passport.use(new LocalStrategy( (username, password, done) => {
    db.query('SELECT * FROM credentials.user where username = ?', [username], async(err, results) => {
        if (err) { return done(err) }
        if (!results.length) {
            return done(null, false, {message: 'Invalid username'})
        }
        const user = results[0]
        await bcrypt.compare(password, user.password, (err, res) => {
            if (err) {
                return done(err)
            } 
            if (!res){
                return done(null, false, {message: 'Invalid password'});
            }
            return done(null, user) 
        })
    })
    
}))

passport.serializeUser((user, done) => {
    done(null, user.username)
})  

passport.deserializeUser((username, done) => {
    db.query('SELECT * FROM credentials.user where username = ?', [username], (err, results) => {
        if (err) { return done(err) }
        if (!results.length) {
            return done(null, false)
        }
        const user = results[0]
        console.log("Deserialized user:",user);
        return done(null, user)
    })
})
router.post('/login',async (req, res, next) => {
    console.log('login request received:', req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err) { return res.stastus(500).json({message:'internal server error'}) }
        if (!user) {
            return res.status(401).json({message: info.message})
        }
        req.login(user, (err) => {
        if (err){
            return next(err)
        } 
            res.json('success:true')
        })
    })(req, res, next)  
}) 


let usernames=[];

router.post('/checkUsername', (req, res) => {
  const { username } = req.body;

  if(usernames.includes(username)){
    console.log('username included in usernames')
    console.log(usernames)
    return res.json({exists:true})
  }

  connection.query('SELECT * FROM credentials.user WHERE username = ?', [username], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: '사용자 이름을 확인하는 중 오류가 발생했습니다.' });
    }
    if (rows.length!=0){
      usernames.push(username)
    }
    res.json({ exists: rows.length > 0 });
  });
});

router.post('/register',async(req,res)=>{
  console.log(req.body.username, req.body.password)
  let hash = await bcrypt.hash(req.body.password,10)
  const q=`INSERT INTO credentials.user (username, password) VALUES ('${req.body.username}', '${hash}')`
  connection.query(q,(err)=>{
    if(err){
      console.log(err);
      return res.status(500).json({message:"Error occured during register process"})
    }
    res.json({success: true})
  })

})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware
  }

  // User is not authenticated, send an error response
  return res.status(401).json({ message: 'Unauthorized' });
}


module.exports=router;