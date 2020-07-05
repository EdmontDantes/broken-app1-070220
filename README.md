1. fixed process.env typo in app.js mongoose
  .connect(process.env.MONGODB_URI,

2. added .env variable MONGODB_URI, PORT, SESSION_SECRET

3. added public/images to my own ide for ease of viewing the website and testing purposes

4. in routes/index.js for '/' route res.render fixed from res.render('home') to res.render('main/home')
5. tested the views for '/' , 'api/users/login' and 'api/users/register' -  the pages render as expected.

6. it appears that /register post route doesn't create a user in database, looked into usrRoutes.js and need to look in controller , userRoutes -> moved router.post('/register') below router.get('/register')
  
7. uncommented in app.js app.use(cookieParser()); line 36
   
8. added module.exports = mongoose.model('user', UserSchema); line at the end of User.js mongoose model
   
9.  testing the register functionality after corrective modifications.
    
10. tested POST /api/users/register 500 returns {
"message": "Failed",
"error": {}
}, viewed Robo 3T mongodb GUI and reviewing the debug-shopper-app it seems that previous corrections were able to create users collection but not the data inside of it. Tested again with different user data in register section of website - same results.

11. found wrongly formatted code 65-72 in userRoutes.js router.post(
  '/local- login',
  passport.authenticate('local', {
    successRedirect: 'main/home',
    failureRedirect: 'api/users/login',
    failureFlash: true
  })
);

to 

router.post('/login', passport.authenticate('local-login',{
  successRedirect:'/',
  failureRedirect:'/api/users/login',
  failureFlash:true
})
);

12. fixed userController on line 11     try {
      const { name, email, password } = body; ->  to req.body;
      line 6 added next parameter -> register: async (req, res, next) => {

13. It seems that userController register function is not working in try section of the async function, going to       console.log(name, email, password) to see if they req.body is actually being deconstructed; result is yes it is being decontructed and logged, moving further testing.
14.   In userController line 19 ->   user = await new User({ profile: { name }, email, password });
      console.log(user); -- here tested for creating new user, it seems that user.save(); doesn't work to save into database.

15. looking in console.log from previous step 14, password seems NOT to be hashed via bcrypt, that might be an issue with UserSchema.pre code in User.js models directory, I need to investigate there now.
    
16. bcryptjs is never brought into User.js model hence added line 3 -> const bcrypt = require('bcryptjs');, and verified that bcryptjs is indeed in package.json list of installed Node packages.

17. tested via chrome browser register functionality, once all fields were inputted the redirect took me back to '/' base route, viewed Robo 3T and results are that users collection is created along with the correct record that was inputted via browser. Tested login and not sure whether it works, going to adjust views so I can see greeting for user's name in the header to right-corner and logout anchor.

18. changed line 59 return res.render('main/home') to return res.redirect(301, '/');, the login still doesn't work though. I suspect that router.post('login') doesn't work, need to check lib/passport.js and verify that local-login strategy works, I am logging out req.user variable in login get router first to see if when login via browser user is passed through. user variable in get login route didn't show a user, I'm going to log out req.body.
19. fixed in login.ejs instead of 'already a member?' to 'Need to Sign Up?'