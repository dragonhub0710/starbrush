import React, { useState, useEffect } from "react";
import { Button, Avatar, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getWithExpiry } from "@/util/services";

export function Gallery() {
  const navigate = useNavigate();
  const [imgURLs, setImgURLs] = useState([]);
  const [selectedImg, setSelectedImg] = useState("");
  const [selectedIdx, setSeletedIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (screen.width < 640) {
      setIsMobile(true);
    }
    let list = getWithExpiry("image_urls");
    let selected_idx = getWithExpiry("selected_idx");
    if (list.length != 0) {
      setImgURLs(list);
      setSeletedIdx(selected_idx);
      setSelectedImg(list[selected_idx]);
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (imgURLs.length != 0) {
      setSelectedImg(imgURLs[selectedIdx]);
    }
  }, [selectedIdx]);

  const handlePrevImage = () => {
    setSeletedIdx(selectedIdx - 1);
  };

  const handleNextImage = () => {
    setSeletedIdx(parseInt(selectedIdx) + 1);
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex w-full flex-col">
        <div className="flex w-full bg-white">
          {isMobile ? (
            <div className="header-shadow relative flex h-[90px] w-full items-center justify-between px-8">
              <a href="/">
                <Avatar
                  src="img/logo.svg"
                  className="h-auto w-56 rounded-none"
                />
              </a>
            </div>
          ) : (
            <div className="container flex w-full items-center px-5 py-2">
              <Avatar src="/img/mark.svg" className="ml-4 h-auto w-10" />
              <Button
                variant="text"
                className="flex items-center"
                onClick={handleBack}
              >
                <Avatar src="img/prev.svg" className="mr-2 h-5 w-auto" />
                <Typography
                  varient="h3"
                  className="text-base font-bold uppercase text-black"
                >
                  Gallery
                </Typography>
              </Button>
            </div>
          )}
        </div>
        {isMobile && (
          <Button
            variant="text"
            className="flex items-center pt-5"
            onClick={handleBack}
          >
            <Avatar src="img/prev.svg" className="mx-2 h-5 w-auto" />
            <Typography
              varient="h3"
              className="text-base font-bold uppercase text-black"
            >
              Gallery
            </Typography>
          </Button>
        )}
        <div className="container mx-auto flex flex-col items-center justify-center px-8 pt-12">
          <Avatar
            src={selectedImg}
            className="h-auto w-full max-w-[600px]"
          ></Avatar>
          <div className="my-10 flex w-full justify-center">
            <div className="flex h-[40px] w-[100px] justify-between rounded-full border-2 border-black">
              <Button
                variant="text"
                disabled={selectedIdx == 0}
                className="rounded-full p-0"
                onClick={handlePrevImage}
              >
                <Avatar src="img/prev.svg" className="mx-2 h-6 w-auto" />
              </Button>
              <Button
                variant="text"
                disabled={selectedIdx == imgURLs.length - 1}
                className="rounded-full p-0"
                onClick={handleNextImage}
              >
                <Avatar src="img/next.svg" className="mx-2 h-6 w-auto" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gallery;
