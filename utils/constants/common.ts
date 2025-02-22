import {
  IExperience,
  IPath,
  IProject,
  IProjectExperience,
} from "@/types/common";

export const navLinks: IPath[] = [
  {
    name: "Home",
    path: "#home",
  },
  // {
  //   name: "Projects",
  //   path: "",
  // },
  {
    name: "Experience",
    path: "#experience",
  },
  {
    name: "Contact",
    path: "#contact",
  },
];

export const experienceIcons: IExperience[] = [
  {
    icon: "/icons/javascript.svg",
    name: "Javascript",
  },
  {
    icon: "/icons/nodejs.svg",
    name: "Nodejs",
  },
  {
    icon: "/icons/html.svg",
    name: "Html",
  },
  {
    icon: "/icons/css.svg",
    name: "css",
  },
  {
    icon: "/icons/reactjs.svg",
    name: "Reactjs",
  },
  {
    icon: "/icons/tailwind.svg",
    name: "Tailwind",
  },
  {
    icon: "/icons/svelte.svg",
    name: "Svelte",
  },
  {
    icon: "/icons/vue.svg",
    name: "Vuejs",
  },
  {
    icon: "/icons/astro.svg",
    name: "Astro",
  },
];

export const projects: IProject[] = [
  {
    name: "html tutorial",
    thumbnail: "/images/project-thumbnail-1.png",
  },
  { name: "css tutorial", thumbnail: "/images/project-thumbnail-2.png" },
];

export const projectExperiences: IProjectExperience[] = [
  {
    date: "Nov 2022 - Present",
    description:
      "I contribute to the development of CRM, CMS, and e-commerce systems using Vue.js, Nuxt.js, Astro, and Svelte. Collaborating closely with backend teams, I optimize API performance, enhance UI/UX, and improve website efficiency. My work focuses on optimizing Lighthouse performance to ensure fast-loading, SEO-friendly web applications.",
    // icon: "/icons/google-logo.svg",
    name: "Frontend Developer at MGI Solutions",
  },
  {
    date: "Apr 2019 - JUL 2022",
    description:
      "As part of an international software development team, I participated in building online education platforms, debt collection management systems, and simulation tools. I was responsible for developing user interfaces with React.js and Vue.js, ensuring a seamless user experience across multiple platforms.",
    // icon: "/icons/apple-logo.svg",
    name: "Frontend Developer at FPT Software",
  },
];
