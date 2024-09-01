import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import { brainwaveSymbol } from "../assets";

const ChatList = ({ handleMenu }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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

  const isActive = (path) => {
    return location.pathname === path ? "bg-[#2c2937] rounded-xl" : "";
  };

  const handleDelete = (chatId) => {
    deleteMutation.mutate(chatId);
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
              <Link
                className={`flex-grow p-3`}
                to={`/dashboard/chats/${chat.chatId}`}
              >
                <p className="text-ellipsis line-clamp-1">{chat.chatTitle}</p>
              </Link>
              <button
                title="Delete Chat"
                onClick={() => handleDelete(chat.chatId)}
                className="hover:bg-[#2c2937] rounded-full p-2 focus:outline-none"
              >
                <i className="fa-solid fa-trash-xmark"></i>
              </button>
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
