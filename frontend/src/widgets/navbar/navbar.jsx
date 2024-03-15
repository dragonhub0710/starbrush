import React, { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";

export function Navbar(props) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (screen.width < 640) {
      setIsMobile(true);
    }
  }, []);
  return (
    <div
      className={`${
        isMobile
          ? "navbar-bottom bottom-0 pb-5 pt-20"
          : "navbar-top top-0 mt-[90px]"
      } fixed z-40 w-full`}
    >
      <div className="container mx-auto px-8">
        <div className="mb-2">
          <Typography className="text-xl font-bold text-black sm:text-3xl">
            Create your imagination
          </Typography>
        </div>
        <div className="mt-5">
          <Button
            onClick={props.onStartChat}
            className="h-[40px] rounded-full bg-black px-[20px] py-[5px] text-sm font-medium tracking-[2px] text-white shadow-none hover:shadow-none"
          >
            START CONVERSATION
          </Button>
        </div>
      </div>
    </div>
  );
}

Navbar.displayName = "/src/widgets/navbar/navbar.jsx";

export default Navbar;
