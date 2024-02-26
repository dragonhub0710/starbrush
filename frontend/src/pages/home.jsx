import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Avatar, Typography } from "@material-tailwind/react";
import { MyLoader } from "@/widgets/loader/MyLoader";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { getWithExpiry, setWithExpiry } from "@/util/services";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Header from "@/widgets/header/header";
import Navbar from "@/widgets/navbar/navbar";
import Chatting from "@/widgets/chatting/chatting";

export function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imgURLs, setImgURLs] = useState([]);
  const [isShowReportEmail, setIsShowReportEmail] = useState(false);
  const [isChatting, setIsChatting] = useState(false);
  const [isLazyloading, setIsLazyloading] = useState(false);
  const [isShadow, setIsShadow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    if (screen.width < 640) {
      setIsMobile(true);
    }
    let list = getWithExpiry("image_urls");
    if (list) {
      setImgURLs(list);
      setIsLazyloading(true);
    } else {
      setIsLazyloading(false);
    }
  }, []);

  const handleCreateImage = (msg_list) => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASED_URL}/image`, { list: msg_list })
      .then((res) => {
        if (res.data) {
          let list = [...res.data];
          setImgURLs(list);
          setIsShadow(true);
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

  const handleStartChat = () => {
    setIsChatting(true);
  };

  const closeChatting = () => {
    setIsChatting(false);
  };

  return (
    <>
      <div className="relative flex w-full flex-col">
        {loading && <MyLoader isShadow={isShadow} />}
        <Header isShadow={imgURLs.length > 0 ? true : false} />
        {imgURLs.length == 0 && <Navbar onStartChat={handleStartChat} />}
        <div
          className={`container relative mx-auto overflow-hidden ${
            isMobile || imgURLs.length > 0 ? "mt-16" : "mt-48"
          } mb-2 h-full p-8`}
        >
          <div
            className={`my-5 grid h-[600px] w-full grid-cols-2 grid-rows-4 gap-2 sm:h-[300px] sm:grid-cols-4 sm:grid-rows-5 sm:gap-3 md:h-[400px] md:gap-5 lg:h-[500px]`}
          >
            {layout_style_up.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`z-0 ${item.layout} transform cursor-pointer rounded-lg border-[2px] bg-[#9c9c9c] transition-all duration-300 hover:z-10 hover:scale-110`}
                >
                  {isLazyloading ? (
                    <LazyLoadImage
                      src={imgURLs[idx]}
                      width={"100%"}
                      height={"100%"}
                      effect="blur"
                      onClick={() => handleViewImage(idx)}
                      className="h-full w-full rounded-lg"
                    />
                  ) : (
                    <LazyLoadImage
                      src={item.link}
                      width={"100%"}
                      height={"100%"}
                      effect="blur"
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
                  className={`z-0 ${item.layout} transform cursor-pointer rounded-lg border-[2px] bg-[#9c9c9c] transition-all duration-300 hover:z-10 hover:scale-110`}
                >
                  {isLazyloading ? (
                    <LazyLoadImage
                      src={imgURLs[idx + 5]}
                      width={"100%"}
                      height={"100%"}
                      effect="blur"
                      onClick={() => handleViewImage(idx + 5)}
                      className="h-full w-full rounded-lg"
                    />
                  ) : (
                    <LazyLoadImage
                      src={item.link}
                      width={"100%"}
                      height={"100%"}
                      effect="blur"
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
        <Chatting onClose={closeChatting} onCreateImages={handleCreateImage} />
      )}
      {isShowReportEmail && (
        <div className="fixed right-0 top-0 z-40 flex h-full w-full items-center justify-center rounded-md bg-[#ffffff8f]">
          <div className="modal-container relative h-full w-full max-w-[900px] bg-black p-8 sm:flex sm:max-h-[600px] sm:p-0">
            {isMobile && (
              <div className="mb-2 flex w-full justify-end">
                <Button
                  variant="text"
                  className="p-0"
                  onClick={closeReportEmail}
                >
                  <Avatar src="img/close.svg" className="h-auto w-6" />
                </Button>
              </div>
            )}
            <Avatar
              src="img/img4.jpg"
              className="h-[300px] w-full rounded-none sm:h-full sm:w-1/2"
            />
            <div className="relative flex h-1/2 w-full flex-col items-center justify-center p-4 sm:h-full sm:w-1/2">
              {!isMobile && (
                <div className="absolute right-3 top-3 mb-2 flex w-full justify-end">
                  <Button
                    variant="text"
                    className="p-0"
                    onClick={closeReportEmail}
                  >
                    <Avatar src="img/close.svg" className="h-auto w-6" />
                  </Button>
                </div>
              )}
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
