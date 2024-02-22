import React from "react";
import Lottie from "react-lottie";
import loading from "../loading.json";

export function MyLoader() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loading,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="fixed z-50 h-full w-full bg-white">
      <div className="flex h-full items-center justify-center">
        <div className="h-56 w-56">
          <Lottie options={defaultOptions} isClickToPauseDisabled={true} />
        </div>
      </div>
    </div>
  );
}

MyLoader.displayName = "/src/widgets/loader/MyLoader.jsx";

export default MyLoader;
