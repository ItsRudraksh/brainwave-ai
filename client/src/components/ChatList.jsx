/* eslint-disable react/prop-types */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import { brainwaveSymbol } from "../assets";
import { useState, useRef, useEffect } from "react";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const ChatList = ({ handleMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingChatId, setEditingChatId] = useState(null);
  const [titleInput, setTitleInput] = useState("");
  const titleInputRef = useRef(null);

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/userchats`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationFn: (chatId) =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate("/dashboard");
    },
  });

  // Title update mutation
  const titleMutation = useMutation({
    mutationFn: ({ chatId, title }) => {
      return fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${chatId}/title`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        }
      ).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update chat title');
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      setEditingChatId(null);
      toast.success("Chat title updated!");
    },
    onError: (err) => {
      toast.error(`Failed to update title: ${err.message}`);
    },
  });

  // Focus on input when editing starts
  useEffect(() => {
    if (editingChatId && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingChatId]);

  const isActive = (path) => {
    return location.pathname === path ? "bg-[#2c2937] rounded-xl" : "";
  };

  const handleDelete = (chatId) => {
    deleteMutation.mutate(chatId);
  };

  // Start editing a chat title
  const handleEditClick = (e, chat) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingChatId(chat.chatId);
    setTitleInput(chat.chatTitle);
  };

  // Save the edited title
  const handleSaveTitle = (chatId) => {
    if (titleInput.trim() === "") {
      toast.error("Title cannot be empty");
      return;
    }
    titleMutation.mutate({ chatId, title: titleInput });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingChatId(null);
  };

  // Handle keyboard events in title input
  const handleKeyDown = (e, chatId) => {
    if (e.key === "Enter") {
      handleSaveTitle(chatId);
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="chatList flex flex-col h-full lg:pt-20 pr-5 lg:pr-0">
      <span className="title font-semibold text-xs mb-3 pt-2 lg:pt-0">
        DASHBOARD
      </span>
      <Link
        onClick={() => handleMenu(false)}
        className={`rounded-xl p-3 hover:bg-[#2c2937] mt-4 lg:mt-0 ${isActive(
          "/dashboard"
        )}`}
        to="/dashboard"
      >
        Create a new Chat
      </Link>
      <Link
        onClick={() => handleMenu(false)}
        className={`rounded-xl p-3 hover:bg-[#2c2937] ${isActive("/")}`}
        to="/"
      >
        Explore Brainwave
      </Link>
      <Link
        onClick={() => handleMenu(false)}
        className="rounded-xl p-3 hover:bg-[#2c2937]"
        to="mailto:rudraksh746.be22@chitkara.edu.in"
      >
        Contact
      </Link>
      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded mt-5 mb-5 ml-0 mr-0" />
      <span className="title font-semibold text-xs mb-3">RECENT CHATS</span>
      <div className="list flex flex-col overflow-y-scroll">
        {isPending ? (
          <Loader />
        ) : error ? (
          <p className="text-red-500">
            An error occurred. Please try again later.
          </p>
        ) : data?.length === 0 ? (
          "No chats yet. Start new!"
        ) : (
          data?.map((chat) => (
            <div
              onClick={() => handleMenu(false)}
              title={chat.chatTitle}
              key={chat.chatId}
              className={`flex items-center justify-between relative rounded-xl mb-2 hover:bg-[#2c2937] ${isActive(
                `/dashboard/chats/${chat.chatId}`
              )}`}
            >
              {editingChatId === chat.chatId ? (
                <div className="flex items-center p-2 flex-grow gap-1">
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, chat.chatId)}
                    className="bg-[#3a3744] text-white px-2 py-1 rounded-md w-full outline-none focus:ring-1 focus:ring-[#ac6aff]"
                    placeholder="Enter chat title..."
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveTitle(chat.chatId);
                    }}
                    className="p-1 bg-[#ac6aff] rounded-md hover:bg-opacity-80 transition-all"
                    title="Save"
                  >
                    <CheckIcon size={16} className="text-white" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                    className="p-1 bg-[#4d4d57] rounded-md hover:bg-opacity-80 transition-all"
                    title="Cancel"
                  >
                    <XIcon size={16} className="text-white" />
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    className="flex-grow p-3"
                    to={`/dashboard/chats/${chat.chatId}`}
                  >
                    <p className="text-ellipsis line-clamp-1">{chat.chatTitle}</p>
                  </Link>
                  <div className="flex items-center">
                    <button
                      title="Edit Title"
                      onClick={(e) => handleEditClick(e, chat)}
                      className="hover:bg-[#2c2937] rounded-full p-2 focus:outline-none text-gray-400 hover:text-white transition-colors"
                    >
                      <PencilIcon size={14} />
                    </button>
                    <button
                      title="Delete Chat"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(chat.chatId);
                      }}
                      className="hover:bg-[#2c2937] rounded-full p-2 focus:outline-none"
                    >
                      <i className="fa-solid fa-trash-xmark"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      <hr className="border-none h-[2px] bg-[#ddd] opacity-10 rounded mt-5 mb-5 ml-0 mr-0" />
      <div className="upgrade mt-auto flex items-center text-xs gap-3 mb-2">
        <img
          src={brainwaveSymbol}
          width={24}
          height={24}
          alt="Brainwave symbol"
        />
        <div className="texts flex flex-col">
          <span className="font-semibold">Upgrade to Brainwave Pro</span>
          <span className="text-[#888]">
            Get unlimited access to all features
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
