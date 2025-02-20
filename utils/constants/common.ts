import {
  IExperience,
  IPath,
  IProject,
  IProjectExperience,
} from "@/types/common";

export const navLinks: IPath[] = [
  {
    name: "Home",
    path: "",
  },
  {
    name: "Projects",
    path: "",
  },
  {
    name: "Experience",
    path: "",
  },
  {
    name: "Contact",
    path: "",
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
    date: "Nov 2019 - Present",
    description:
      "As a Senior Software Engineer at Google, I played a pivotal role in developing innovative solutions for Google's core search algorithms. Collaborating with a dynamic team of engineers, I contributed to the enhancement of search accuracy and efficiency, optimizing user experiences for millions of users worldwide.",
    // icon: "/icons/google-logo.svg",
    projectName: "Lead Software Engineer at Google",
  },
  {
    date: "Jan 2016 - Dec 2017",
    description:
      "During my tenure at Apple, I held the role of Software Architect, where I played a key role in shaping the architecture of mission-critical software projects. Responsible for designing scalable and efficient systems, I provided technical leadership to a cross-functional team.",
    // icon: "/icons/apple-logo.svg",
    projectName: "Junior Software Engineer at Apple",
  },
  {
    date: "Jan 2017 - Oct 2019",
    description:
      "At Meta, I served as a  Software Engineer, focusing on the design and implementation of backend systems for the social media giant's dynamic platform. Working on projects that involved large-scale data processing and user engagement features, I leveraged my expertise to ensure seamless functionality and scalability.",
    // icon: "/icons/meta-logo.svg",
    projectName: "Software Engineer at Meta",
  },
];
