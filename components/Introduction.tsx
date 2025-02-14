const Introduction = () => {
  return (
    <>
      <div className="text-5xl mx-auto text-white text-center space-y-1.5">
        <p>I do code and</p>
        <p>
          make content{" "}
          <span className="bg-gradient-to-r from-salmon from-20% via-electric-violet via-100% text-transparent bg-clip-text">
            about it!
          </span>
        </p>
      </div>

      <div className="max-w-2xl mx-auto text-secondary text-lg text-center">
        I am a seasoned full-stack software engineer with over 8 years of
        professional experience, specializing in backend development. My
        expertise lies in crafting robust and scalable SaaS-based architectures
        on the Amazon AWS platform.
      </div>

      <div className="mx-auto space-x-[18px]">
        <button className="bg-white border-2 py-4 px-[30px] rounded-[50px] font-semibold text-cod-gray">
          Get In Touch
        </button>
        <button className="border-2 border-white text-white py-4 px-[30px] rounded-[50px] font-semibold ">
          Download CV
        </button>
      </div>
    </>
  );
};

export default Introduction;
