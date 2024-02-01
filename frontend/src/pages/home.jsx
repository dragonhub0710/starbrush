import React, { useState } from "react";
import axios from "axios";
import { Input, Button, Avatar, Typography } from "@material-tailwind/react";
import { MyLoader } from "@/widgets/loader/MyLoader";
import { notification } from "antd";

export function Home() {
  const [loading, setLoading] = useState(false);
  const [imgURL, setImgURL] = useState();
  const [prompt, setPrompt] = useState("");

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleCreateImage = () => {
    setLoading(true);
    console.log(prompt);
    axios
      .post(`${process.env.REACT_APP_BASED_URL}/image`, { prompt: prompt })
      .then((res) => {
        setImgURL(res.data);
        setLoading(false);
        notification.success({ message: "Successfully generated AI image." });
      })
      .catch((error) => {
        setLoading(false);
        notification.error({ message: "Failed to generate AI image." });
        console.log(error);
      });
  };

  return (
    <>
      <div className="relative flex h-screen content-center items-center justify-center">
        {loading && <MyLoader isloading={loading} />}
        <div className="bg-custom-background absolute top-0 h-full w-full bg-cover bg-center" />
        <div className="max-w-8xl container relative mx-auto">
          <div className="flex w-full flex-wrap items-center">
            <div className="mx-auto w-full rounded px-4 pt-8 text-center lg:w-8/12">
              <div className="mx-auto mb-5 flex w-full justify-center">
                <Typography className="tracking text-2xl font-bold uppercase tracking-[5px] text-white">
                  StarBrush.ai
                </Typography>
              </div>
              <div className="border-neutral-500 bg-gray mx-auto my-5 min-h-[300px] w-full  rounded border-2 border-solid sm:min-h-[500px] sm:max-w-[500px]">
                {imgURL && (
                  <Avatar
                    src={imgURL}
                    variant="rounded"
                    className="h-full w-full"
                  />
                )}
              </div>
              <div className="w-full">
                <Input
                  onChange={handlePromptChange}
                  value={prompt}
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                />
                <div className="flex items-center justify-end px-5 py-3">
                  <Button
                    size="md"
                    onClick={handleCreateImage}
                    className="mx-2 bg-white text-black shadow-none hover:shadow-none"
                  >
                    Generate Image
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
