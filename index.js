const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors')
require('events').EventEmitter.defaultMaxListeners = 12;

const PORT = process.env.PORT || 3001;
const app = express();

const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

// Static directory
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors({credentials: true, origin: process.env.server}))
//Models, routes & middleware
const db = require("./models");

app.use(require('./routes/users'));
app.use(require('./routes/commands'));

db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });
});