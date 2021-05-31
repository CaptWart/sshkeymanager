const router = require('express').Router();
const passport = require('passport');
require('../middleware/ldap')
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/login', passport.authenticate('ldapauth', {session: false}), function(req, res) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    const token = jwt.sign({id: req.user.uid, email: req.user.mail}, process.env.jwtsecret, {
      expiresIn: '3600s'
    });
    return res.cookie('token', token, { httpOnly: true, secure: false }).sendStatus(200);
  
});

router.get('/user', auth, (req, res, next) => {
  const user = {id: req.id, email: req.email}
  return res.send(user)
});

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.end();
})

module.exports = router;