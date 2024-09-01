import NewPrompt from "../components/NewPrompt";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { useQuery } from "@tanstack/react-query";
import { clipBoardIcon, brainwaveSymbol } from "../assets";
import User from "../components/User";
import Loader from "../components/Loader";
const Chat = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  return (
    <div className="h-full flex flex-col items-center relative pt-11">
      <div className="flex-1 overflow-scroll w-full flex justify-center">
        <div className="w-[75%] ml-10 lg:ml-0 lg:w-1/2 flex flex-col gap-5">
          {isPending ? (
            <Loader />
          ) : error ? (
            "Something went wrong!"
          ) : (
            data?.history?.map((message, i) => (
              <>
                {message.img && (
                  <IKImage
                    key={i}
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                    className="self-end object-contain"
                  />
                )}
                <div
                  className={`${
                    message.role === "user"
                      ? "p-5 bg-[#2c2937] rounded-[20px] flex flex-col max-w-[80%] self-end"
                      : "p-5 bg-[#2a2732] rounded-[20px]"
                  }`}
                  key={i}
                >
                  {message.role === "user" ? (
                    <div className="self-end">
                      <User bgColor="ac6aff" />
                    </div>
                  ) : (
                    <div className="w-8 h-9 mb-3">
                      <img src={brainwaveSymbol} alt="" />
                    </div>
                  )}
                  <Markdown
                    className={`${
                      message.role === "user" ? "" : "overflow-x-auto"
                    }`}
                  >
                    {message.parts[0].text}
                  </Markdown>
                  {message.role === "user" ? (
                    ""
                  ) : (
                    <button
                      className="bg-transparent w-6 h-6 mt-3 opacity-75 hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(message.parts[0].text)}
                      title="Copy to clipboard"
                    >
                      <img src={clipBoardIcon} alt="" />
                    </button>
                  )}
                </div>
              </>
            ))
          )}
          {data && <NewPrompt data={data} />}
        </div>
      </div>
    </div>
  );
};

export default Chat;
