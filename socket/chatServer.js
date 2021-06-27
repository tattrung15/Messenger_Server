const io = require("socket.io");
const xss = require("xss");

module.exports = {
  listen(server) {
    const chatServer = io(server, {
      cors: {
        origin: "*",
      },
      transports: ["polling"],
    });

    chatServer.on("connection", (socket) => {
      // console.log(socket.id);
    });
  },
};
