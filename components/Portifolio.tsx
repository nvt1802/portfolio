"use client";

import Headers from "@/components/Header";
import Avatar from "@/components/Avatar";
import Introduction from "@/components/Introduction";
import ExperiencesWith from "@/components/ExperiencesWith";
// import Projects from "@/components/Projects/index";
import Experiences from "@/components/Experiences/index";

const Portifolio = () => {
  return (
    <>
      <div className="h-full w-full bg-cod-gray pb-5">
        <Headers />

        <div className="flex mt-24 flex-col gap-8">
          <Avatar />

          <Introduction />

          <ExperiencesWith />

          {/* <Projects /> */}

          <Experiences />
        </div>
      </div>
    </>
  );
};

export default Portifolio;
