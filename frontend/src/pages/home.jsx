import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Input, Button, Avatar, Typography } from "@material-tailwind/react";
import { MyLoader } from "@/widgets/loader/MyLoader";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { getWithExpiry, setWithExpiry } from "@/util/services";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { TypeWriter } from "@/widgets/TypeWriter/TypeWriter";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export function Home() {
  let stream_res = "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imgURLs, setImgURLs] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isShowReportEmail, setIsShowReportEmail] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [msglist, setMsglist] = useState([]);
  const chatWindowRef = useRef(null);
  const [response, setResponse] = useState("");
  const [isLazyloading, setIsLazyloading] = useState(false);

  const layout_style_up = [
    {
      layout: "sm:col-span-2 sm:row-span-5",
      link: "/img/img1.jpg",
    },
    { layout: "sm:row-span-2", link: "/img/img2.jpg" },
    {
      layout: "sm:row-span-3 sm:col-span-1 row-span-2 col-span-2",
      link: "/img/img3.jpg",
    },
    { layout: "sm:row-span-3", link: "/img/img4.jpg" },
    { layout: "sm:row-span-2", link: "/img/img5.jpg" },
  ];
  const layout_style_down = [
    { layout: "sm:row-span-2", link: "/img/img6.jpg" },
    { layout: "sm:row-span-3", link: "/img/img7.jpg" },
    {
      layout: "sm:col-span-2 sm:row-span-5 row-span-2 col-span-2",
      link: "/img/img8.jpg",
    },
    { layout: "sm:row-span-3", link: "/img/img9.jpg" },
    { layout: "sm:row-span-2", link: "/img/img10.jpg" },
  ];

  useEffect(() => {
    let list = getWithExpiry("image_urls");
    if (list) {
      setImgURLs(list);
      setIsLazyloading(true);
    } else {
      setIsLazyloading(false);
    }
    let msg_list = [];
    msg_list.push({
      role: "assistant",
      content: `Hey I'm Sam from Starbrush. I'm able to create any inspiration for your dream home or architecture project!
Let's start by knowing what you'd like to visualise?
A house? Interior decoration? Or even a piece of furniture you want to create?`,
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
        await fetchEventSource(`${process.env.REACT_APP_BASED_URL}/chat`, {
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
              setResponse((response) => response + JSON.parse(event.data).data);
            }
          },
        });
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

  const handleCreateImage = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASED_URL}/image`, { list: msglist })
      .then((res) => {
        if (res.data) {
          let list = [...res.data];
          setImgURLs(list);
          setWithExpiry("image_urls", list);
          setIsChatting(false);
          setIsLazyloading(true);
        }
        setLoading(false);
        notification.success({ message: "Successfully generated AI images." });
      })
      .catch((error) => {
        setLoading(false);
        notification.error({ message: "Failed to generate AI image." });
        console.log(error);
      });
  };

  const handleViewImage = (idx) => {
    if (imgURLs[idx]) {
      navigate("/view");
      setWithExpiry("selected_idx", idx);
    }
  };

  const handleReportEmail = () => {
    setIsShowReportEmail(true);
  };

  const closeReportEmail = () => {
    setIsShowReportEmail(false);
  };

  const handleKeyDown = (event) => {
    if (event.key == "Enter") {
      handleSubmitChat();
    }
  };

  const handleStartChat = () => {
    setIsChatting(true);
  };

  const closeChatting = () => {
    setIsChatting(false);
  };

  return (
    <>
      <div className="relative flex w-full flex-col">
        {loading && <MyLoader />}
        <div
          className={`${
            imgURLs.length == 0 ? "headerWithTopOpacity" : "headerWithShadow"
          } w-full`}
        >
          <div
            className={`container mx-auto mt-5 flex w-full flex-col px-2 ${
              imgURLs.length == 0 && "sm:pb-32"
            } pb-5 pt-5`}
          >
            <a href="/">
              <div
                className={`z-50 ${
                  imgURLs.length == 0 && "sm:mb-20"
                } mb-5 w-full`}
              >
                <Avatar
                  src="img/logo.svg"
                  className="h-auto w-56 rounded-none"
                />
              </div>
            </a>
            {imgURLs.length == 0 && (
              <div
                className={`flex w-full flex-col items-center justify-center pb-10 pt-10`}
              >
                <div className="mb-2 w-full ">
                  <Typography className="text-xl font-bold text-black sm:text-3xl">
                    Tell us about your dream home
                  </Typography>
                </div>
                <div className="relative mt-5 flex w-full">
                  <Button
                    onClick={handleStartChat}
                    className="h-[40px] rounded-full bg-black px-[20px] py-[5px] text-sm font-medium tracking-[2px] text-white shadow-none hover:shadow-none"
                  >
                    START CONVERSATION
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className={`container relative mx-auto overflow-hidden ${
            imgURLs.length == 0 && "sm:mt-72"
          } mb-2 mt-32 h-full p-8`}
        >
          <div
            className={`my-5 grid h-[600px] w-full grid-cols-2 grid-rows-4 gap-2 sm:h-[300px] sm:grid-cols-4 sm:grid-rows-5 sm:gap-3 md:h-[400px] md:gap-5 lg:h-[500px]`}
          >
            {layout_style_up.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`z-0 ${item.layout} transform cursor-pointer rounded-lg border-[2px] transition-all duration-300 hover:z-10 hover:scale-110`}
                >
                  {isLazyloading ? (
                    <LazyLoadImage
                      src={imgURLs[idx]}
                      width={"100%"}
                      height={"100%"}
                      effect="blur" // Optional: Apply a blur effect
                      onClick={() => handleViewImage(idx)}
                      className="h-full w-full rounded-lg"
                    />
                  ) : (
                    <LazyLoadImage
                      src={item.link}
                      width={"100%"}
                      height={"100%"}
                      effect="blur" // Optional: Apply a blur effect
                      className="h-full w-full rounded-lg"
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="my-5 grid h-[600px] w-full grid-cols-2 grid-rows-4 gap-2 sm:h-[300px] sm:grid-cols-4 sm:grid-rows-5 sm:gap-3 md:h-[400px] md:gap-5 lg:h-[500px]">
            {layout_style_down.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`z-0 ${item.layout} transform cursor-pointer rounded-lg border-[2px] transition-all duration-300 hover:z-10 hover:scale-110`}
                >
                  {isLazyloading ? (
                    <LazyLoadImage
                      src={imgURLs[idx + 5]}
                      width={"100%"}
                      height={"100%"}
                      effect="blur" // Optional: Apply a blur effect
                      onClick={() => handleViewImage(idx + 5)}
                      className="h-full w-full rounded-lg"
                    />
                  ) : (
                    <LazyLoadImage
                      src={item.link}
                      width={"100%"}
                      height={"100%"}
                      effect="blur" // Optional: Apply a blur effect
                      className="h-full w-full rounded-lg"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {imgURLs.length != 0 && (
          <div className="bottom-background absolute bottom-0 z-20 flex h-28 w-full justify-center">
            <Button
              variant="text"
              onClick={handleReportEmail}
              className="mt-5 flex h-[40px] items-center justify-center rounded-full border-2 border-black bg-white py-0 text-black shadow-none hover:bg-white hover:shadow-none"
            >
              Show More
            </Button>
          </div>
        )}
      </div>
      {isChatting && (
        <div className="fixed right-0 top-0 z-30 flex h-full w-full items-center justify-center bg-[#ffffff8f] p-2">
          <div className="modal-container h-full max-h-[700px] w-full rounded-lg sm:max-w-[900px]">
            <div className="relative flex h-16 w-full items-center justify-center bg-black px-3">
              <Avatar src="/img/mark-white.svg" className="h-auto w-10" />
              <div className="absolute right-0 top-0">
                <Button variant="text" className="p-2" onClick={closeChatting}>
                  <Avatar src="img/close.svg" className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="chat-container flex w-full flex-col justify-between bg-[#fff] opacity-90">
              <div
                className="flex h-full w-full flex-col overflow-y-auto p-4"
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
              <div className="relative my-2 flex w-full border-t-[1px] border-black p-4">
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
                  <div className="absolute right-0 mx-2 flex h-full items-center">
                    <Button
                      onClick={handleSubmitChat}
                      variant="text"
                      className="mx-2 h-full w-fit p-0"
                    >
                      <Avatar src="img/plus.svg" className="mx-2 h-5 w-5" />
                    </Button>
                    <Button
                      onClick={handleCreateImage}
                      className="h-[30px] rounded-full bg-black px-[20px] py-[5px] text-white shadow-none hover:shadow-none"
                    >
                      Build
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isShowReportEmail && (
        <div className="fixed right-0 top-0 z-30 flex h-full w-full items-center justify-center rounded-md bg-[#ffffff8f] p-2">
          <div className="modal-container relative h-full max-h-[400px] w-full max-w-[900px] rounded-lg bg-black sm:flex sm:max-h-[600px]">
            <div className="absolute right-3 top-3 z-40 flex w-full justify-end">
              <Button variant="text" className="p-0" onClick={closeReportEmail}>
                <Avatar src="img/close.svg" className="h-auto w-6" />
              </Button>
            </div>
            <Avatar
              src="img/img4.jpg"
              className="h-1/2 w-full rounded-l-lg sm:h-full sm:w-1/2 sm:rounded-r-none"
            />
            <div className="flex h-1/2 w-full flex-col items-center justify-center p-4 sm:h-full sm:w-1/2">
              <div className="mx-auto max-w-[340px]">
                <div className="w-full">
                  <Typography className="text-base font-semibold text-white sm:text-xl md:text-3xl">
                    Thank you for enjoying the demo of Starbrush
                  </Typography>
                </div>
                <div className="mt-5 w-full">
                  <Typography
                    variant="h5"
                    className="text-base font-normal text-white"
                  >
                    Please leave your best contact email to let you when the
                    full version is out
                  </Typography>
                </div>
                <div className="relative mt-5 flex w-full">
                  <Input
                    className="report-email-input w-full rounded-full px-5 text-base"
                    placeholder="Add your description here"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                  ></Input>
                  <div className="absolute right-0 mx-2 flex h-full items-center">
                    <Button className="h-[30px] rounded-full bg-black px-[20px] py-[5px] text-white shadow-none hover:shadow-none">
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
