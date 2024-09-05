import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Typography,
  Textarea,
} from "@material-tailwind/react";
import axios from "axios";
import Lottie from "react-lottie";
import Loading_Animation from "@/widgets/circle_loading.json";

export function BgDiffusion() {
  const [imageFile, setImageFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [newImageURLs, setNewImageURLs] = useState([null, null, null]);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
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

  const handleNewGenerate = () => {
    if (prompt == "" || !imageFile) return;
    setNewImageURLs([null, null, null]);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("prompt", prompt);
    setIsLoading(true);
    axios
      .post(
        `${import.meta.env.VITE_API_BASED_URL}/api/image/diffusion`,
        formData
      )
      .then((res) => {
        setNewImageURLs(res.data.images);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleDownload = async (url) => {
    if (!url) return;

    try {
      let imageFetch = await fetch(url);
      let imageBlob = await imageFetch.blob();
      let imageURL = URL.createObjectURL(imageBlob);

      let link = document.createElement("a");
      link.href = imageURL;
      link.download = `${Date.now()}.jpeg`;
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
          <Card className="flex h-full w-fit justify-between rounded-2xl px-8 py-3 shadow-[0_3px_3px_-2px_rgba(0,0,0,0.2),0_3px_4px_0_rgba(0,0,0,0.14),0_1px_8px_0_rgba(0,0,0,0.12)]">
            <label
              htmlFor="dropzone-file2"
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
                  or drop a PNG file here
                </Typography>
              </div>
              <input
                id="dropzone-file2"
                type="file"
                accept=".png"
                onChange={handleFileChanger}
                className="hidden"
              />
            </label>
          </Card>
          {imageFile && (
            <div className="flex w-full flex-col justify-center">
              <div className="flex w-full justify-center">
                <Card className="mt-10 flex h-full w-fit justify-between gap-3 rounded-2xl p-3 shadow-[0_3px_3px_-2px_rgba(0,0,0,0.2),0_3px_4px_0_rgba(0,0,0,0.14),0_1px_8px_0_rgba(0,0,0,0.12)]">
                  <div className="relative h-fit w-full max-w-[400px] rounded-lg">
                    <div className="h-fit w-full rounded-lg bg-[url('img/transparency.svg')] bg-cover bg-center">
                      <Avatar
                        src={imageURL}
                        className="h-full w-auto rounded-lg"
                      />
                    </div>
                    {!isLoading && (
                      <div
                        onClick={() => setImageFile(null)}
                        className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-[#6363638a] hover:bg-[#8d8d8d8a]"
                      >
                        <Avatar src="img/close.svg" className="h-auto w-5" />
                      </div>
                    )}
                  </div>
                  <div className="h-fit w-full rounded-lg border-2 border-[#e5e5e5] pt-2">
                    <Textarea
                      rows={3}
                      onChange={(e) => setPrompt(e.target.value)}
                      value={prompt}
                      className="min-h-full w-full rounded-none !border-0 px-3 text-base text-black focus:border-transparent"
                      placeholder="Please describe the entire image you want to generate here"
                      labelProps={{
                        className: "before:content-none after:content-none",
                      }}
                      containerprops={{
                        className: "grid h-full",
                      }}
                    />
                  </div>
                </Card>
              </div>
              <div className="my-5 flex w-full justify-center">
                <Button
                  onClick={handleNewGenerate}
                  className="m-4 flex w-fit items-center rounded-2xl bg-[#E82155] px-10 text-lg normal-case"
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
                  Generate
                </Button>
              </div>
              <div className="flex w-full flex-wrap justify-center gap-3">
                {(isLoading || newImageURLs[0] != null) &&
                  newImageURLs.map((item, idx) => {
                    return (
                      <Card
                        key={idx}
                        className="mt-10 flex h-fit w-fit flex-col justify-between gap-3 rounded-2xl p-3 shadow-[0_3px_3px_-2px_rgba(0,0,0,0.2),0_3px_4px_0_rgba(0,0,0,0.14),0_1px_8px_0_rgba(0,0,0,0.12)]"
                      >
                        <div className={`h-[300px] w-[300px] rounded-lg`}>
                          {isLoading && (
                            <div className="relative h-full w-full animate-pulse">
                              <div className="h-full w-full rounded-lg bg-[#636363]"></div>
                            </div>
                          )}
                          {item && (
                            <Avatar
                              src={item}
                              className="relative h-auto w-auto rounded-lg"
                            />
                          )}
                        </div>
                        {item && (
                          <div className="flex w-full justify-end">
                            <Button
                              onClick={() => handleDownload(item)}
                              className="text-md flex w-fit items-center rounded-2xl bg-[#E82155] px-5 normal-case lg:px-6 lg:text-lg"
                            >
                              Download
                            </Button>
                          </div>
                        )}
                      </Card>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default BgDiffusion;
