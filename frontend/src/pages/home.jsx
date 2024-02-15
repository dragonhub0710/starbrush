import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Button, Avatar, Typography } from "@material-tailwind/react";
import { MyLoader } from "@/widgets/loader/MyLoader";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { getWithExpiry, setWithExpiry } from "@/util/services";

export function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [imgURLs, setImgURLs] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isShowReportEmail, setIsShowReportEmail] = useState(false);
  const layout_style_up = [
    { layout: "col-span-2 row-span-5", link: "/img/img1.jpg" },
    { layout: "row-span-2", link: "/img/img2.jpg" },
    { layout: "row-span-3", link: "/img/img3.jpg" },
    { layout: "row-span-3", link: "/img/img4.jpg" },
    { layout: "row-span-2", link: "/img/img5.jpg" },
  ];
  const layout_style_down = [
    { layout: "row-span-2", link: "/img/img6.jpg" },
    { layout: "row-span-3", link: "/img/img7.jpg" },
    { layout: "col-span-2 row-span-5", link: "/img/img8.jpg" },
    { layout: "row-span-3", link: "/img/img9.jpg" },
    { layout: "row-span-2", link: "/img/img10.jpg" },
  ];

  const handleScroll = () => {
    if (window.scrollY > 120) {
      setHasShadow(true);
    } else {
      setHasShadow(false);
    }
  };

  useEffect(() => {
    let list = getWithExpiry("image_urls");
    if (list) {
      setImgURLs(list);
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleCreateImage = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_BASED_URL}/image`, { prompt: prompt })
      .then((res) => {
        if (res.data) {
          let list = [...res.data];
          setImgURLs(list);
          setWithExpiry("image_urls", list);
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
      handleCreateImage();
    }
  };

  return (
    <>
      <div className="relative flex w-full flex-col">
        {loading && <MyLoader isloading={loading} />}
        <div
          className={`w-full bg-white ${hasShadow ? "headerWithShadow" : ""}`}
        >
          <div className={`container mx-auto flex w-full flex-col px-2 py-5`}>
            {!hasShadow && (
              <div>
                <div className="mb-8 w-full">
                  <Typography className=" text-base font-bold uppercase tracking-[5px] text-black sm:text-lg">
                    StarBrush.ai
                  </Typography>
                </div>
                <div className="mb-5 w-full">
                  <Typography className="text-xl font-bold text-black sm:text-3xl">
                    Tell us about your dream home
                  </Typography>
                </div>
              </div>
            )}
            <div className="relative flex w-full">
              {hasShadow && (
                <Avatar src="/img/logo.svg" className="mx-2 h-auto w-10" />
              )}
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
                  onClick={handleCreateImage}
                  className="h-[30px] rounded-full bg-black px-[20px] py-[5px] text-white shadow-none hover:shadow-none"
                >
                  Build
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`container relative mx-auto h-full px-2 ${
            hasShadow ? "mt-[200px]" : "mt-5"
          }`}
        >
          <div className="my-5 grid w-full grid-cols-4 grid-rows-5 gap-2 sm:h-[300px] sm:gap-3 md:h-[400px] md:gap-5 lg:h-[500px]">
            {layout_style_up.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`z-0 ${item.layout} transform cursor-pointer rounded-lg border-[2px] transition-all duration-300 hover:z-10 hover:scale-110`}
                >
                  <Avatar
                    src={imgURLs[idx] || item.link}
                    onClick={() => handleViewImage(idx)}
                    className="h-full w-full rounded-lg"
                  />
                </div>
              );
            })}
          </div>
          <div className="my-5 grid w-full grid-cols-4 grid-rows-5 gap-2 sm:h-[300px] sm:gap-3 md:h-[400px] md:gap-5 lg:h-[500px]">
            {layout_style_down.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`z-0 ${item.layout} transform cursor-pointer rounded-lg border-[2px] transition-all duration-300 hover:z-10 hover:scale-110`}
                >
                  <Avatar
                    src={imgURLs[idx + 5] || item.link}
                    onClick={() => handleViewImage(idx + 5)}
                    className="h-full w-full rounded-lg"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="bottom-background absolute bottom-0 z-20 flex h-28 w-full justify-center">
          <Button
            variant="text"
            onClick={handleReportEmail}
            className="mt-5 flex h-[40px] items-center justify-center rounded-full border-2 border-black bg-white py-0 text-black shadow-none hover:bg-white hover:shadow-none"
          >
            Show More
          </Button>
        </div>
      </div>
      {isShowReportEmail && (
        <div className="fixed right-0 top-0 z-30 flex h-full w-full items-center justify-center rounded-md bg-[#ffffff8f] p-2">
          <div className="report-email-container relative h-full max-h-[400px] w-full max-w-[900px] rounded-lg bg-black sm:flex sm:max-h-[600px]">
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
