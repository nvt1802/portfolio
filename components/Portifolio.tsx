"use client";

import Headers from "@/components/Header";
import Avatar from "@/components/Avatar";
import Introduction from "@/components/Introduction";
import ExperiencesWith from "@/components/ExperiencesWith";
// import Projects from "@/components/Projects/index";
import Experiences from "@/components/Experiences/index";
import Footer from "@/components/Footer";

const Portifolio = () => {
  return (
    <>
      <div className="h-full w-full bg-cod-gray flex flex-col gap-12 sm:gap-20">
        <Headers />

        <div className="flex flex-col gap-8 mx-4">
          <Avatar />

          <Introduction />

          <ExperiencesWith />

          {/* <Projects /> */}

          <Experiences />
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Portifolio;
