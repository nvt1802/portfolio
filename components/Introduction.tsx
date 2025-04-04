const Introduction = () => {
  return (
    <>
      {/* <div className="text-5xl mx-auto text-white text-center space-y-1.5">
        <p>I do code and</p>
        <p>
          make content{" "}
          <span className="bg-gradient-to-r from-salmon from-20% via-electric-violet via-100% text-transparent bg-clip-text">
            about it!
          </span>
        </p>
      </div> */}

      <div className="max-w-2xl mx-auto text-secondary text-base sm:text-lg text-center space-y-2">
        <p>
          I am a Frontend Developer passionate about building and optimizing web
          interfaces. With a logical mindset and creativity, I always seek ways
          to enhance user experience through intuitive design, high performance,
          and clean code.
        </p>
        <p>
          I am always looking for opportunities to grow and contribute to
          innovative projects that bring real value to users.
        </p>
      </div>

      <div className="mx-auto flex flex-row gap-5 flex-wrap justify-center w-full">
        <button className="bg-white border-2 py-2.5 sm:py-4 text-sm leading-5 sm:text-base px-6 sm:px-[30px] rounded-[50px] font-semibold text-cod-gray">
          Get In Touch
        </button>
        <a
          href="/files/nvt-cv.pdf"
          download="nvt-cv.pdf"
          className="border-2 border-white text-white py-2.5 sm:py-4 px-[30px] rounded-[50px] font-semibold text-sm sm:text-base leading-5"
        >
          Download CV
        </a>
      </div>
    </>
  );
};

export default Introduction;
