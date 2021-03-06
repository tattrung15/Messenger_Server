# Socket Documentation

### Socket Events

[Socket Events](https://github.com/tattrung15/Messenger_Server/blob/develop/socket/constants/index.js)

## Liên kết nhanh

- [Kết nối socket](#kết-nối-socket)
- [Lấy các cuộc trò chuyện](#lấy-các-cuộc-trò-chuyện)
- [Tạo cuộc trò chuyện](#tạo-cuộc-trò-chuyện)
- [Ngắt kết nối](#ngắt-kết-nối)
- [Join room](#join-room)
- [Gửi tin nhắn](#gửi-tin-nhắn)
- [Gửi file hoặc hình ảnh](#gửi-file-hoặc-hình-ảnh)
- [Rời cuộc trò chuyện](#rời-cuộc-trò-chuyện)

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

#### Khi kết nối thành công sẽ có 2 sự kiện được gửi từ server

Sự kiện: `server-send-current-user`

Mô tả: Thông tin của người dùng hiện tại được gửi đến người dùng hiện tại

```Javascript
socket.on("server-send-current-user", (data) => {});
```

Sự kiện: `server-send-users-online`

Mô tả: Thông tin danh sách người dùng đang online được gửi đến tất cả người dùng

```Javascript
socket.on("server-send-users-online", (data) => {});
```

#### Khi kết nối thất bại sẽ có sự kiện được gửi từ server đến người hiện tại

Sự kiện: `connect_error`

Mô tả: Nhập thông báo lỗi khi kết nối thất bại

```Javascript
socket.on("connect_error", (error) => {});
```

### Lấy các cuộc trò chuyện

Yêu cầu: Gửi sự kiện `client-get-conversations` đến server. Sau khi gửi sẽ được server phản hồi sự kiện `server-send-conversations-of-user` nhận thông tin các cuộc trò chuyện của người dùng

```Javascript
socket.emit("client-get-conversations");
```

Mô tả: Lấy danh sách cuộc trò chuyện hiện có của người dùng

```Javascript
socket.on("server-send-conversations-of-user", (data) => {});
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

#### Thành công thì có sự kiện `server-send-current-conversation` gửi từ server đến người dùng hiện tại

Sự kiện: `server-send-conversations`

Mô tả: Nhận thông tin của người dùng hiện tại

```Javascript
socket.on("server-send-conversations", (data) => {});
```

#### Khi tạo thành công sẽ có sự kiện gửi từ server đến tất cả người dùng

Sự kiện: `server-send-conversations`

Mô tả: Nhận thông tin của người dùng hiện tại

```Javascript
socket.on("server-send-conversations", (data) => {});
```

### Ngắt kết nối

Sự kiện: `server-send-users-online`

Mô tả: Khi có người ngắt kết nối sẽ có sự kiện gửi từ server đến tất cả người dùng. Nhận thông tin các người dùng đang online

```Javascript
socket.on("server-send-users-online", (data) => {});
```

### Join room

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
  conversationId: ObjectId, // "6103d11b0b9979175cdc3325"
  fromUserId: ObjectId, // "60d85c8f093d7e260c5b1c7c"
  message: String,
});
```

- Gửi tin nhắn thành công sẽ có sự kiện `server-send-message-to-author` được gửi từ server đến người gửi bao gồm thông tin của tin nhắn vừa gửi
- Và sự kiện `server-send-message` được gửi từ server đến mọi người trong room trừ người gửi
- Gửi tin nhắn thất bại sẽ có sự kiện `error` được gửi từ server

### Gửi file hoặc hình ảnh

Yêu cầu: join room

Sự kiện: `client-send-file`

Mô tả: Gửi file hoặc hình ảnh

```Javascript
const file = {
  conversationId: ObjectId, // "60d85c8f093d7e260c5b1c7c"
  fromUserId: ObjectId, // "60d85c8f093d7e260c5b1c7c"
  fileName: String, // "Trung.jpg"
  dataBuffer: File,
  fileType: String, // "image/jpeg"
  fileSize: Number, // 230739
};
socket.emit("client-send-file", file);
```

- Gửi file thành công sẽ có sự kiện `server-send-file-to-author` được gửi từ server đến người gửi bao gồm thông tin của file vừa gửi
- Và sự kiện `server-send-file` được gửi từ server đến mọi người trong room trừ người gửi
- Gửi file thất bại sẽ có sự kiện `error` được gửi từ server

**Chú ý:**

- Kích thước tối đa của file gửi lên: 5MB (có thể tùy chỉnh trong file configs/configuration.js và option maxHttpBufferSize trong file socket/chatServer.js)
- Không cho phép upload file có định dạng `.dll` và `.exe`

### Rời cuộc trò chuyện

Sự kiện: `client-leave-conversation`

Mô tả: Người dùng rời khỏi cuộc trò chuyện

```Javascript
socket.emit("client-leave-conversation", {
  roomId: ObjectId, // conversationId: "6103d11b0b9979175cdc3325"
});
```

- Rời thành công sẽ có sự kiện `server-send-leave-conversation-to-user` được gửi từ server đến người dùng thông tin của người vừa rời
- Và sự kiện `server-send-leave-conversation` được gửi từ server đến mọi người trong room trừ người gửi
- Rời thất bại sẽ có sự kiện `error` được gửi từ server
