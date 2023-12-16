import { Socket } from "socket.io";
import { Message, User } from "../models";

class SocketController {
  connection = (socket: Socket) => {

    socket.on("join-chat", (data) => {
      const { userId, chatId } = data;
      socket.join(chatId);
      socket.broadcast.to(chatId).emit("user-connected", userId);
    });

    socket.on("leave-chat", (data) => {
      const { userId, chatId } = data;
      socket.leave(chatId);
      socket.broadcast.to(chatId).emit("user-disconnected", userId);
    });

    socket.on("send-message", async (data) => {
      const { content, userId, chatId } = data;

      const message = new Message({
        content: content,
        userId: userId,
        chatId: chatId,
      });

      await message.save();
      const user = await User.findOne({ _id: userId });

      socket.broadcast.to(chatId).emit("receive-message", { content, userId: user?.toSafeObject()});
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  };
}

export default new SocketController();
