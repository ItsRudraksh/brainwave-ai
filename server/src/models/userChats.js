import mongoose from "mongoose";

const userChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chats: [
      {
        chatId: {
          type: String,
          required: true,
        },
        chatTitle: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("UserChats", userChatSchema);
