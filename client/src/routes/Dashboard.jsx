import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brainwave, arrowImg, chatImg, dbImg, codeImg } from "../assets";
const Dashboard = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (text) => {
      return await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: async (res) => {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${res.chatId}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    e.target.text.value = "";
    mutation.mutate(text);
  };

  return (
    <div className="dashboardPage w-full flex h-full items-center flex-col">
      <div className="texts flex-1 flex flex-col items-center justify-center w-1/2 gap-[50px]">
        <div className="logo flex items-center gap-5 opacity-20">
          <img src={brainwave} alt="" className="w-[280px]" />
        </div>
        <div className="options hidden sm:flex w-full items-center justify-between gap-[50px]">
          <div className="option flex-1 flex flex-col gap-[10px] font-light text-sm p-5 border-2 border-solid border-[#555] rounded-[20px]">
            <img src={chatImg} alt="" className="w-10 h-10 object-cover" />
            <span className="whitespace-nowrap">Create a New Chat</span>
          </div>
          <div className="option flex-1 flex flex-col gap-[10px] font-light text-sm p-5 border-2 border-solid border-[#555] rounded-[20px]">
            <img src={dbImg} alt="" className="w-10 h-10 object-cover" />
            <span className="whitespace-nowrap">Analyze Images</span>
          </div>
          <div className="option flex-1 flex flex-col gap-[10px] font-light text-sm p-5 border-2 border-solid border-[#555] rounded-[20px]">
            <img src={codeImg} alt="" className="w-10 h-10 object-cover" />
            <span className="whitespace-nowrap">Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className="formContainer mt-auto w-[80%] sm:w-1/2 bg-[#2c2937] rounded-[20px] flex mb-2">
        <form
          className="w-full h-full flex items-center justify-between gap-5 mb-[10px]"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="text"
            placeholder="Ask me anything..."
            className="flex-1 p-5 bg-transparent border-none outline-none text-[#ececec]"
          />
          <button className="bg-[#605e68] rounded-full border-none cursor-pointer p-[10px] flex items-center justify-center mr-5">
            <img src={arrowImg} alt="" className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
