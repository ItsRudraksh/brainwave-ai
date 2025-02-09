import UserChats from "../models/userChats.js";
import Chat from "../models/chat.js";
import mongoose from "mongoose";
export const handleChatMessage = async (req, res) => {
  const userId = req.user.id; // This comes from the verifyToken middleware
  const { text } = req.body;

  try {
    // CREATE A NEW CHAT
    const newChat = new Chat({
      userId: userId,
      history: [{ role: "user", parts: [{ text }] }],
    });
    const savedChat = await newChat.save();

    // CHECK IF THE USERCHATS EXISTS
    const userChats = await UserChats.findOne({ userId: userId });

    if (!userChats) {
      // IF DOESN'T EXIST CREATE A NEW ONE AND ADD THE CHAT IN THE CHATS ARRAY
      const newUserChats = new UserChats({
        userId: userId,
        chats: [
          {
            chatId: savedChat._id,
            chatTitle: text,
          },
        ],
      });
      await newUserChats.save();
    } else {
      // IF EXISTS, PUSH THE CHAT TO THE EXISTING ARRAY
      await UserChats.updateOne(
        { userId: userId },
        {
          $push: {
            chats: {
              chatId: savedChat._id,
              chatTitle: text,
            },
          },
        }
      );
    }

    res.status(201).json({ chatId: savedChat._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating chat!" });
  }
};

export const getUserChats = async (req, res) => {
  const userId = req.user.id;

  try {
    const userChats = await UserChats.findOne({ userId });

    if (!userChats) {
      return res.status(200).send([]);
    }

    res.status(200).send(userChats.chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching user chats!");
  }
};

export const getChat = async (req, res) => {
  const userId = req.user.id;

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });

    res.status(200).send(chat);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching chat!");
  }
};

export const chatWithAi = async (req, res) => {
  const userId = req.user.id;
  const { userprompt, answer, img } = req.body;
  const newItems = [
    ...(userprompt
      ? [{ role: "user", parts: [{ text: userprompt }], ...(img && { img }) }]
      : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.updateOne(
      { _id: req.params.id, userId },
      {
        $push: {
          history: {
            $each: newItems,
          },
        },
      }
    );
    res.status(200).send(updatedChat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error doing chatting");
  }
};

export const deleteChat = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const chatId = req.params.id;
    const userId = req.user.id;

    // Delete the chat from the Chat collection
    const deletedChat = await Chat.findOneAndDelete({
      _id: chatId,
      userId: userId,
    }).session(session);

    if (!deletedChat) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Chat not found or you do not have permission to delete it",
      });
    }

    // Remove the chat from the UserChats collection
    const updatedUserChats = await UserChats.findOneAndUpdate(
      { userId: userId },
      { $pull: { chats: { chatId: chatId } } },
      { new: true, session }
    );

    if (!updatedUserChats) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "UserChats not found" });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting chat:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the chat" });
  }
};
