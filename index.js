const express = require("express");
const session = require("express-session");
const redis = require("redis");
const redisClient = redis.createClient();
const redisStore = require("connect-redis")(session);

const app = express();

redisClient.on("error", err => {
  console.log("Redis error: ", err);
});

app.use(
  session({
    secret: "TODO-super-secret",
    name: ".Phantom.Session",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new redisStore({
      host: "localhost",
      port: 6379,
      client: redisClient,
      ttl: 86400
    })
  })
);

app.get("/", function(req, res) {
  req.session.basketId = Math.floor(Math.random() * 10000000 + 1);
  res.send("Welcome");
});

app.get("/login", function(req, res) {
  req.session.isLoggedIn = true;
  res.send("logged in now");
});

app.get("/logout", function(req, res) {
  req.session.isLoggedIn = false;
  res.send("ok logged out");
});

app.get("/dump_session", function(req, res, mext) {
  sessions = req.session;
  res.send(sessions);
});

app.listen(4000);
console.log("listening on port 4000");
