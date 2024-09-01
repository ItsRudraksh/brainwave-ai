import { useEffect, useRef, useState } from "react";
import { arrowImg, brainwaveSymbol } from "../assets";
import Upload from "./Upload";
import { IKImage } from "imagekitio-react";
import model from "../config/geminiConfig";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "./Loader";
import axios from "axios";
import User from "./User";
const NewPrompt = ({ data }) => {
  const [userprompt, setUserPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const [done, setDone] = useState(false);

  const chat = model.startChat({
    history:
      data?.history?.map(({ role, parts }) => ({
        role: role || "user", // Default to 'user' if role is undefined
        parts: parts.map((part) => ({ text: part.text })), // Ensure parts are correctly mapped
      })) || [], // Default to an empty array if history is undefined
    generationConfig: {
      maxOutputTokens: 10000,
    },
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behaviour: "smooth" });
  }, [data, userprompt, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/chat/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userprompt: userprompt.length ? userprompt : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setUserPrompt("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
          setDone(false);
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleImageDelete = async () => {
    try {
      if (!img.dbData.fileId) {
        throw new Error("Image file ID not found");
      }
      await axios.delete(
        `https://api.imagekit.io/v1/files/${img.dbData.fileId}`,
        {
          headers: {
            Authorization: `Basic ${btoa(
              import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY + ":"
            )}`,
          },
        }
      );
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
      setDone(false);
    } catch (error) {
      console.log("Error deleting image:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && img.dbData?.fileId) {
        handleImageDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [img.dbData?.fileId]);

  const promptAI = async (prompt, isInitial) => {
    if (!isInitial) setUserPrompt(prompt);
    try {
      setUserPrompt(prompt);
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, prompt] : [prompt]
      );
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        setAnswer((prev) => prev + chunkText);
      }
      mutation.mutate();
      console.log(data?.history);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    if (img.dbData) {
      setDone(true);
    }
    e.target.text.value = "";
    promptAI(text, false);
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        promptAI(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {img.dbData?.filePath && done && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
          className="self-end"
        />
      )}
      {userprompt && (
        <div className="p-5 bg-[#2c2937] rounded-[20px] max-w-[80%] self-end flex flex-col">
          <div className="self-end">
            <User bgColor="ac6aff" />
          </div>
          {userprompt}
        </div>
      )}
      {answer && (
        <div className="p-5 bg-[#2a2732] rounded-[20px]">
          <div className="w-8 h-9 mb-3">
            <img src={brainwaveSymbol} alt="" />
          </div>
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="pb-[100px]" ref={endRef}></div>
      <form
        className="w-[75%] lg:w-1/2 absolute bottom-0 bg-[#2c2937] rounded-[20px] flex justify-center px-5 flex-col"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="flex">
          {img.isLoading && (
            <div className="p-3">
              <Loader />
            </div>
          )}
          {img.dbData?.filePath && !done && (
            <div className="relative group">
              <IKImage
                urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                path={img.dbData?.filePath}
                width="380"
                transformation={[{ width: 380 }]}
                className="self-end py-2"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-center">
                  Press ESC to delete image
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-5">
          <Upload setImg={setImg} />
          <input id="file" type="file" multiple={false} className="hidden" />
          <input
            type="text"
            name="text"
            placeholder="Ask anything..."
            className="flex-1 py-5 border-none outline-none bg-transparent text-[#ececec]"
          />
          <button className="rounded-full bg-[#605e68] border-none p-2.5 flex items-center justify-center cursor-pointer">
            <img src={arrowImg} alt="" className="w-4 h-4" />
          </button>
        </div>
      </form>
    </>
  );
};

export default NewPrompt;
