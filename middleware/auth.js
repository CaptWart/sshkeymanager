const jwt = require('jsonwebtoken');

var dotenv = require('dotenv');
dotenv.config();

const parseCookie = str =>
  str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

const auth = async function(req, res, next) {
  
  const cookieHead = req.headers.cookie;
  const cookie = req.query.token;
  let token = "";
  if(cookieHead){
    token = parseCookie(cookieHead).token;
  }
  else{
    token = cookie;
  }
  
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, process.env.jwtsecret, function(err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
        
      } else {
        req.email = decoded.email;
        req.id = decoded.id;
        next();
      }
    });
  }
}

module.exports = auth;
