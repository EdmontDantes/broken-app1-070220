const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('main/home');
});

//this route is correct so do not EDIT IT
router.get('/logout', (req, res) => {
  res.clearCookie('connect.sid', {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null
  });
  req.session.destroy();

  return res.redirect('/');
});

module.exports = router;
