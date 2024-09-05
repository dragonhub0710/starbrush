import React, { useState } from "react";
import { Avatar, Button, Card, Typography } from "@material-tailwind/react";
import axios from "axios";
import Lottie from "react-lottie";
import Loading_Animation from "@/widgets/circle_loading.json";

export function RemoveBg() {
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [updatedImageURL, setUpdatedImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingOptions = {
    loop: true,
    autoplay: true,
    animationData: Loading_Animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleFileChanger = (e) => {
    let file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBG = () => {
    setUpdatedImageURL(null);
    const formData = new FormData();
    formData.append("file", imageFile);
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_BASED_URL}/api/image/removebg`,
        formData
      )
      .then((res) => {
        setUpdatedImageURL(res.data.image);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDownload = async () => {
    if (!updatedImageURL) return;

    try {
      let imageFetch = await fetch(updatedImageURL);
      let imageBlob = await imageFetch.blob();
      let imageURL = URL.createObjectURL(imageBlob);

      let link = document.createElement("a");
      link.href = imageURL;
      link.download = `${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <>
      <div className="my-10 flex w-full flex-col justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Card className="flex h-full w-fit flex-row flex-wrap justify-between gap-3 rounded-2xl px-8 py-3 shadow-[0_3px_3px_-2px_rgba(0,0,0,0.2),0_3px_4px_0_rgba(0,0,0,0.14),0_1px_8px_0_rgba(0,0,0,0.12)]">
            <label
              htmlFor="dropzone-file1"
              className="flex h-full w-full cursor-pointer flex-col items-center justify-center"
            >
              <div className="flex flex-col items-center justify-center p-5">
                <div className="flex w-fit items-center justify-center rounded-2xl bg-[#E82155] px-5 py-1 shadow-lg hover:bg-[#e82156b6] lg:px-10">
                  <Avatar
                    src="img/upload.svg"
                    className="m-2 ml-0 h-auto w-6 rounded-none lg:w-8"
                  />
                  <Typography className="text-md font-bold normal-case tracking-widest text-white lg:text-xl">
                    Upload Image
                  </Typography>
                </div>
                <Typography className="mt-2 max-w-[200px] text-center text-sm font-normal text-[#000000c2]">
                  or drop a file here(JPG, JPEG, PNG, WEBP)
                </Typography>
              </div>
              <input
                id="dropzone-file1"
                type="file"
                accept=".jpg, .png, .jpeg, .webp"
                onChange={handleFileChanger}
                className="hidden"
              />
            </label>
          </Card>
          {imageFile && (
            <div className="flex flex-col">
              <Card className="mt-10 flex h-fit w-fit flex-row flex-wrap justify-between gap-3 rounded-2xl p-3 shadow-[0_3px_3px_-2px_rgba(0,0,0,0.2),0_3px_4px_0_rgba(0,0,0,0.14),0_1px_8px_0_rgba(0,0,0,0.12)]">
                <div className="relative h-fit w-full max-w-[400px] rounded-lg">
                  <Avatar src={imageURL} className="h-full w-auto rounded-lg" />
                  {!isLoading && (
                    <div
                      onClick={() => setImageFile(null)}
                      className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#6363638a] hover:bg-[#8d8d8d8a]"
                    >
                      <Avatar src="img/close.svg" className="h-auto w-5" />
                    </div>
                  )}
                </div>
                {(isLoading || updatedImageURL) && (
                  <div
                    className={`h-full w-full max-w-[400px] rounded-lg ${
                      isLoading && "animate-pulse"
                    } ${
                      updatedImageURL &&
                      "bg-[url('img/transparency.svg')] bg-cover bg-center"
                    }`}
                  >
                    {isLoading && (
                      <div className="relative h-full w-full">
                        <div className="absolute left-0 top-0 z-10 h-full w-full rounded-lg bg-[#636363]"></div>
                        <Avatar
                          src={imageURL}
                          className="relative h-auto w-auto rounded-full"
                        />
                      </div>
                    )}
                    {updatedImageURL && (
                      <Avatar
                        src={updatedImageURL}
                        className="relative h-auto w-auto rounded-lg"
                      />
                    )}
                  </div>
                )}
              </Card>
              <div className="flex w-full justify-center">
                <Button
                  onClick={handleRemoveBG}
                  className="text-md my-2 mr-2 flex w-fit items-center rounded-2xl bg-[#E82155] px-5 normal-case lg:m-4 lg:px-6 lg:text-lg"
                  disabled={isLoading || !imageFile}
                >
                  {isLoading && (
                    <div className="flex h-8 w-8 items-center justify-center">
                      <Lottie
                        options={loadingOptions}
                        isClickToPauseDisabled={true}
                      />
                    </div>
                  )}
                  Remove background
                </Button>

                <Button
                  onClick={handleDownload}
                  className="text-md my-2 ml-2 flex w-fit items-center rounded-2xl bg-[#E82155] px-5 normal-case lg:m-4 lg:px-6 lg:text-lg"
                  disabled={updatedImageURL ? false : true}
                >
                  Download
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RemoveBg;
