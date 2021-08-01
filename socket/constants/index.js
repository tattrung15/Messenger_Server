module.exports.SocketEvent = {
  ERROR: "error",
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  SV_SEND_CURR_USER: "server-send-current-user",
  SV_SEND_USERS_ONLINE: "server-send-users-online",
  SV_SEND_CONVERSATIONS: "server-send-conversations",
  SV_SEND_CURR_CONVERSATION: "server-send-current-conversation",
  SV_SEND_MESSAGE: "server-send-message",
  SV_SEND_MESSAGE_TO_AUTHOR: "server-send-message-to-author",
  CLIENT_JOIN_ROOM: "client-join-room",
  CLIENT_SEND_MESSAGE: "client-send-message",
  CLIENT_CREATE_CONVERSATION: "client-create-conversation",
};

module.exports.SocketErrorMessage = {
  CREATE_CONVERSATION: "Create new conversation",
  CLIENT_DISCONNECT: "Client disconnect",
  SEND_MESSAGE: "Send message",
  JOIN_ROOM: "Join room",
};
