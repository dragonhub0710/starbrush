import React, { useEffect, useState, useRef } from "react";
import { Avatar, notification, Input, Button } from "@material-tailwind/react";
import { TypeWriter } from "@/widgets/TypeWriter/TypeWriter";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export function Chatting(props) {
  let stream_res = "";
  const [prompt, setPrompt] = useState("");
  const [msglist, setMsglist] = useState([]);
  const chatWindowRef = useRef(null);
  const [response, setResponse] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (screen.width < 640) {
      setIsMobile(true);
    }
    let msg_list = [];
    msg_list.push({
      role: "assistant",
      content: `Hey I'm Sam from Starbrush, here to help you bring your ideas to life through AI-generated images. To get started, could you tell me what you're looking to visualize? Whether it's a scene from a book, a concept for a game, or an abstract idea, I'm here to help you bring it to life.`,
    });
    setMsglist(msg_list);
  }, []);

  useEffect(() => {
    if (msglist.length > 1) {
      const chatWindow = chatWindowRef.current;
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  }, [msglist]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmitChat = () => {
    const item = {
      role: "user",
      content: prompt,
    };
    let list = [...msglist];
    list.push(item);
    setMsglist(list);
    const ctrl = new AbortController();
    async function fetchAnswer() {
      try {
        await fetchEventSource(
          `${import.meta.env.VITE_API_BASED_URL}/api/chat`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              list: list,
            }),
            signal: ctrl.signal,
            onmessage: (event) => {
              if (JSON.parse(event.data).data === "[DONE]") {
                setPrompt("");
                setResponse("");
                updateMsgList(stream_res);
                ctrl.abort();
              } else {
                stream_res += JSON.parse(event.data).data;
                setResponse(
                  (response) => response + JSON.parse(event.data).data
                );
              }
            },
          }
        );
      } catch (err) {
        notification.warning({ message: "Internal Server Error" });
      }
    }
    fetchAnswer();
  };

  const updateMsgList = (answer) => {
    let list = [...msglist];
    list.push({
      role: "user",
      content: prompt,
    });
    list.push({
      role: "assistant",
      content: answer,
    });
    setMsglist(list);
  };

  const handleKeyDown = (event) => {
    if (event.key == "Enter") {
      handleSubmitChat();
    }
  };

  return (
    <div className="fixed right-0 top-0 z-40 flex h-full w-full items-center justify-center bg-[#ffffff8f]">
      <div className="modal-container h-full max-h-[700px] w-full rounded-lg sm:max-w-[900px]">
        {isMobile ? (
          <div className="chatting-header-shadow relative flex h-[90px] w-full items-center justify-between px-8">
            <a href="/">
              <Avatar src="img/logo.svg" className="h-auto w-56 rounded-none" />
            </a>
            <Button variant="text" className="p-0" onClick={props.onClose}>
              <Avatar src="img/black-close.svg" className="h-6 w-6" />
            </Button>
          </div>
        ) : (
          <div className="relative flex h-[90px] w-full items-center justify-between bg-black px-3">
            <div className="h-full w-[40px]" />
            <Avatar src="/img/mark-white.svg" className="h-auto w-10" />
            <Button variant="text" className="p-2" onClick={props.onClose}>
              <Avatar src="img/close.svg" className="h-6 w-6" />
            </Button>
          </div>
        )}
        <div className="chat-mobile-container flex w-full flex-col justify-between">
          <div
            className="flex h-full w-full flex-col overflow-y-auto bg-white p-4 opacity-90"
            ref={chatWindowRef}
          >
            {msglist &&
              msglist.map((item, idx) => {
                return (
                  <div
                    key={idx}
                    className={`my-2 flex w-full ${
                      item.role == "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="w-fit max-w-[70%] rounded bg-[#d7d7d7] p-2">
                      {idx == 0 ? (
                        <TypeWriter
                          content={item.content}
                          box_ref={chatWindowRef}
                          speed={5}
                        />
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.content.includes("\n")
                              ? item.content.replace(/\n/g, "<br />")
                              : item.content,
                          }}
                          className="text-base"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            {response != "" && (
              <div className="my-2 flex w-full">
                <div className="w-fit max-w-[70%] rounded bg-[#d7d7d7] p-2">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: response.includes("\n")
                        ? response.replace(/\n/g, "<br />")
                        : response,
                    }}
                    className="ml-2 text-base"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="relative flex w-full items-center border-t-[1px] border-black bg-white p-4">
            <div className="relative flex w-full">
              <Input
                onChange={handlePromptChange}
                value={prompt}
                onKeyDown={handleKeyDown}
                className="w-full rounded-full px-5 text-base"
                placeholder="Add your description here"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              ></Input>
              <div className="absolute right-0 mx-[4px] flex h-full items-center">
                <Button
                  onClick={handleSubmitChat}
                  variant="text"
                  className="h-8 w-8 rounded-full bg-black p-0 hover:bg-black"
                >
                  <Avatar src="img/chat.svg" className="h-auto w-5" />
                </Button>
              </div>
            </div>
            <Button
              onClick={() => props.onCreateImages(msglist)}
              className={`ml-2 h-[32px] ${
                isMobile ? "w-[36px] p-0" : "px-[20px] py-[5px]"
              } rounded-full bg-black text-white shadow-none hover:shadow-none`}
            >
              {isMobile ? (
                <Avatar src="img/build.svg" className="h-auto w-5" />
              ) : (
                "Build"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

Chatting.displayName = "/src/widgets/chatting/chatting.jsx";

export default Chatting;
