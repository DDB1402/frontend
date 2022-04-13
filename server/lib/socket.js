const io = require("socket.io");
const users = require("./users");

/**
 * Initialize when a connection is made
 * @param {SocketIO.Socket} socket
 */
function initSocket(socket) {
  let id;
  socket
    .on("init", async () => {
      id = await users.create(socket);
      if (id) {
        socket.emit("init", { id });
      } else {
        socket.emit("error", { message: "Failed to generating user id" });
      }
    })
    .on("connect", () => console.log("Connection socket"))
    .on("request", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("request", { from: id });
      }
    })
    .on("call", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("call", { ...data, from: id });
      } else {
        socket.emit("failed");
      }
    })
    .on("end", (data) => {
      const receiver = users.get(data.to);
      if (receiver) {
        receiver.emit("end");
      }
    })
    .on("disconnect", () => {
      users.remove(id);
      console.log(id, "disconnected");
    })
    .on("connect_error", (error) => {
      console.log(`${error}`);
    });
}

module.exports = (server) => {
  io({
    path: "/bridge",
    serveClient: true,
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH"],
    },
  })
    .listen(server, { log: true })
    .on("connection", initSocket);
};
