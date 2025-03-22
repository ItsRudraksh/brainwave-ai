import { toast } from "react-hot-toast";
import NewPrompt from "../components/NewPrompt";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { useQuery } from "@tanstack/react-query";
import { clipBoardIcon, brainwaveSymbol } from "../assets";
import User from "../components/User";
import Loader from "../components/Loader";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark as SyntaxTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

const Chat = () => {
  const [hiddenIndex, setHiddenIndex] = useState(0);
  
  // Function to copy text & show toast
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy text"));
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      const codeString = String(children).replace(/\n$/, "");

      return !inline && match ? (
        <div className="relative overflow-auto">
          <button
            className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded"
            onClick={() => copyToClipboard(codeString)}
          >
            Copy Code
          </button>
          <SyntaxHighlighter
            style={SyntaxTheme}
            language={match[1]}
            PreTag="div"
            {...props}
            customStyle={{
              maxHeight: "none",
              overflowX: "auto",
              whiteSpace: "pre", // Prevent wrapping
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { isPending, error, data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${chatId}`, {
        credentials: "include",
      }).then((res) => res.json()),
  });

  return (
    <div className="h-full flex flex-col items-center relative pt-11">
      <div className="flex-1 overflow-scroll w-full flex justify-center">
        <div className="w-[75%] max-w-[1000px] ml-10 lg:ml-0 lg:w-1/2 flex flex-col gap-5">
          {isPending ? (
            <Loader />
          ) : error ? (
            "Something went wrong!"
          ) : (
            data?.history?.map((message, i) => (
              <div key={`message-${i}`} className={message.role === "user" ? "flex flex-col items-end" : ""}>
                {message.img && (
                  <IKImage
                    key={`img-${i}`}
                    urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                    path={message.img}
                    height="300"
                    width="400"
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                    className="object-contain"
                  />
                )}
                <div
                  className={`p-5 ${
                    message.role === "user"
                      ? "bg-[#2c2937] rounded-[20px] max-w-[80%]"
                      : "bg-[#2a2732] rounded-[20px]"
                  } ${hiddenIndex === i ? "hidden" : ""}`} // Hide first user message
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
                    components={components}
                    className={`${
                      message.role === "user" ? "leading-8" : "overflow-x-scroll leading-8"
                    }`}
                  >
                    {message.parts[0].text}
                  </Markdown>
                  {message.role !== "user" && (
                    <button
                      className="bg-transparent w-6 h-6 mt-3 opacity-75 hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(message.parts[0].text)}
                      title="Copy to clipboard"
                    >
                      <img src={clipBoardIcon} alt="" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
          {data && (
            <NewPrompt
              data={data}
              hiddenIndex={hiddenIndex}
              setHiddenIndex={setHiddenIndex}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
