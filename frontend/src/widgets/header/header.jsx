import React, { useEffect, useState } from "react";
import { Avatar } from "@material-tailwind/react";

export function Header(props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (screen.width < 640) {
      setIsMobile(true);
    }
  }, []);
  return (
    <div
      className={`${
        props.isShadow || isMobile ? "header-shadow" : "header-no-shadow"
      } fixed top-0 z-40 h-[90px] w-full`}
    >
      <div className="container mx-auto p-8">
        <a href="/">
          <Avatar src="img/logo.svg" className="h-auto w-56 rounded-none" />
        </a>
      </div>
    </div>
  );
}

Header.displayName = "/src/widgets/header/header.jsx";

export default Header;
