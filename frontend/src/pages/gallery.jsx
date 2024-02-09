import React, { useState, useEffect } from "react";
import { Button, Avatar, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getWithExpiry } from "@/util/services";

export function Gallery() {
  const navigate = useNavigate();
  const [imgURLs, setImgURLs] = useState([]);
  const [selectedImg, setSelectedImg] = useState("");
  const [selectedIdx, setSeletedIdx] = useState(0);

  useEffect(() => {
    let list = getWithExpiry("image_urls");
    if (list) {
      setImgURLs(list);
    }
    let selected_idx = getWithExpiry("selected_idx");

    setSeletedIdx(selected_idx);
    setSelectedImg(list[selected_idx]);
  }, []);

  useEffect(() => {
    setSelectedImg(imgURLs[selectedIdx]);
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
          <div className="container flex w-full items-center px-5 py-2">
            <Avatar src="/img/logo.svg" className="mx-4 h-auto w-10" />
            <Button
              variant="text"
              className="flex items-center"
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
          </div>
        </div>
        <div className="container mx-auto flex flex-col items-center justify-center px-2">
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
