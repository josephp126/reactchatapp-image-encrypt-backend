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
const socketIo = require("socket.io");



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

const server = http.createServer(app);
const io = socketIo(server, { cors: corsOptions });

const db = require("./app/models");
const Role = db.role;

db.mongoose
  // .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect(appConfig.ENVIRONMENT == 'local' ? `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.COLLECTION}` : dbConfig.URL, {
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
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });

    }
  });
}

//socket IO

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({userId, socketId});
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId );
}

const getUser = () => {
  return users.find((user) => user.userId === userId);
} 

io.on('connection', (socket) => {
  //add user
  // socket.on("addUser", userId => {
  //   addUser(userId, socket.id);
  //   io.emit("getUsers", users);
  // })

  //send message
  socket.on("sendMessage", (pushMessage) => {
    // const user = getUser(receiverId);
    // io.to(user.socketId).emit("getMessage", {
    //   senderId,
    //   text,
    // })
    console.log(pushMessage.content)
    io.emit('getMessage',pushMessage)
  })

  //disconnect user
  socket.on("disconnect", () => {
    console.log("REMOVING...");
    removeUser(socket.id);
    io.emit("getUsers", users);
  })
});

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
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
