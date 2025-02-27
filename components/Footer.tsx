import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#191919] min-h-60 w-full flex px-4 py-6">
      <div id="contact" className="max-w-3xl m-auto text-white">
        <p className="text-2xl">Contact</p>
        <p className="text-secondary text-sm mt-10">
          Experienced Frontend Developer with over 5 years of hands-on
          experience in developing high-performance, scalable, and user-friendly web applications. Proficient in modern frontend technologies like React.js, Vue.js, Nuxt.js, and Astro, with a strong focus on UI/UX optimization and SEO. Passionate about crafting seamless user experiences and enhancing web performance.
        </p>
        <div className="flex gap-2 mt-6">
          <Image src="/icons/email.svg" alt="email" width={16} height={16} />
          <p className="text-sm">tainguyen6600@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
