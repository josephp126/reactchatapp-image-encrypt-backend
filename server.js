const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbConfig = require('./app/config/db.config')
const appConfig = require('./app/config/app.config')
const app = express();
require('dotenv').config();

var http = require("http");
var https = require("https");
var fs = require("fs");
const { Server } = require('socket.io');

var corsOptions = {
  origin: appConfig.APP_URL,
  // origin: 'http://192.168.101.109',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/app/public'));

const db = require("./app/models");
const Role = db.role;

db.mongoose
  // .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect( appConfig.ENVIRONMENT == 'local' ? `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.COLLECTION}`  :  dbConfig.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "owner",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'owner' to roles collection");
      });

    }
  });
}

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to OneChain Chat application." });
});
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/chat.routes')(app);
require('./app/routes/friends.routes')(app);
require('./app/routes/messages.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
