module.exports = (io, socket) => async (data) => {
  const { roomId } = data;
  socket.roomId = roomId;
  socket.join(roomId);
};
