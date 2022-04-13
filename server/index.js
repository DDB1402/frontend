const http = require("http");
const express = require("express");
const config = require("../config");
const socket = require("./lib/socket");

const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/check", (req, res) => {
  res.send("Hello World!");
});

app.use("/", express.static(`${__dirname}/../client/dist`));

server.listen(config.PORT, () => {
  socket(server);
  console.log("Server is listening at :", config.PORT);
});
