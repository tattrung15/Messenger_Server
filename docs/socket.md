# Socket Documentation

### Event socket Enum

[Socket Event Enum](https://github.com/tattrung15/Messenger_Server/blob/develop/socket/constants/index.js)

## Liên kết nhanh

- [Kết nối socket](#kết-nối-socket)
- [Tạo cuộc trò chuyện](#tạo-cuộc-trò-chuyện)
- [Ngắt kết nối](#khi-có-người-ngắt-kết-nối-sẽ-có-sự-kiện-gửi-từ-server-đến-tất-cả-người-dùng)
- [Gửi tin nhắn](#gửi-tin-nhắn)

### Kết nối socket

Thêm option xác thực bằng jwt

Mô tả: Khởi tạo kết nối socket đến server

```Javascript
const socket = io("http://localhost:3000", {
  auth: {
    token: "jwt",
  },
});
```

#### Khi kết nối thành công sẽ có sự kiện được gửi đến server tới người hiện tại

Sự kiện: `server-send-current-user`

Mô tả: Nhận thông tin của người dùng hiện tại

```Javascript
socket.on("server-send-current-user", (data) => {});
```

#### Khi kết nối thất bại sẽ có sự kiện được gửi đến server tới người hiện tại

Sự kiện: `connect_error`

Mô tả: Nhập thông báo lỗi khi kết nối thất bại

```Javascript
socket.on("connect_error", (error) => {});
```

### Tạo cuộc trò chuyện

Sự kiện: `client-create-conversation`

Mô tả: Người dùng tạo mới cuộc trò chuyện

```Javascript
const conversation = {
  typeConversation: String, // "group" or "private"
  title: String, // "HIT - Javascript"
  from: ObjectId, // "60d85c8f093d7e260c5b1c7c"
  to: ObjectId, // "60ff9c51fd4deb28bcefcf64"
  members: Array, // ["60d85c8f093d7e260c5b1c7c", "60ff9c51fd4deb28bcefcf64"]
};
socket.emit("client-create-conversation", conversation);
```

- Tạo cuộc trò chuyện nhóm thì thuộc tính `to` để `null`, `from` là `ObjectId` của người tạo nhóm
- Tạo cuộc trò chuyện thất bại sẽ có sự kiện `error` được gửi từ server

#### Khi tạo thành công sẽ có sự kiện gửi từ server đến tất cả người dùng

Sự kiện: `server-send-conversations`

Mô tả: Nhận thông tin của người dùng hiện tại

```Javascript
socket.on("server-send-conversations", (data) => {});
```

### Khi có người ngắt kết nối sẽ có sự kiện gửi từ server đến tất cả người dùng

Sự kiện: `server-send-users-online`

Mô tả: Nhận thông tin các người dùng đang online

```Javascript
socket.on("server-send-users-online", (data) => {});
```

### Trước khi gửi tin nhắn cần gửi sự kiện join room đến server

Sự kiện: `client-join-room`

Mô tả: Gửi conversationId lên server để join room chat

```Javascript
socket.emit("client-join-room", {
  roomId: ObjectId, // conversationId: "6103d11b0b9979175cdc3325"
});
```

- Join thành công sẽ có sự kiện `server-send-current-conversation` được gửi từ server
- Join thất bại sẽ có sự kiện `error` được gửi từ server

### Gửi tin nhắn

Yêu cầu: join room

Sự kiện: `client-send-message`

Mô tả: Gửi tin nhắn trong room

```Javascript
socket.emit("client-send-message", {
  conversationId: ObjectId, //"6103d11b0b9979175cdc3325"
  fromUserId: ObjectId, //"60d85c8f093d7e260c5b1c7c"
  message: String,
});
```

- Gửi tin nhắn thành công sẽ có sự kiện `server-send-message-to-author` được gửi từ server đến người gửi bao gồm thông tin của tin nhắn vừa gửi.
- Và sự kiện `server-send-message` được gửi từ server đến mọi người trong room trừ người gửi
- Gửi tin nhắn thất bại sẽ có sự kiện `error` được gửi từ server
