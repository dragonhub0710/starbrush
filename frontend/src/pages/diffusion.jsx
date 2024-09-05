import React from "react";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import RemoveBg from "@/widgets/removebg/removebg";
import BgDiffusion from "@/widgets/bgdiffusion/bgdiffusion";

export function Diffusion() {
  return (
    <>
      <div className="container mx-auto h-full w-full p-5">
        <Tabs value="removeBg">
          <TabsHeader>
            <Tab key={"removeBg"} value={"removeBg"}>
              Remove Background
            </Tab>
            <Tab key={"bgDiffusion"} value={"bgDiffusion"}>
              Background Diffusion
            </Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel key={"removeBg"} value={"removeBg"}>
              <RemoveBg />
            </TabPanel>
            <TabPanel key={"bgDiffusion"} value={"bgDiffusion"}>
              <BgDiffusion />
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </>
  );
}

export default Diffusion;
