"use client";

import Image from "next/image";
import Link from "next/link";

interface IPath {
  name: string;
  path: string;
}

const Portifolio = () => {
  const navLinks: IPath[] = [
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
  return (
    <>
      <div className="w-screen h-screen bg-cod-gray">
        <div className="h-20 w-full bg-mine-shaft">
          <div className="mx-auto max-w-5xl flex flex-row justify-between">
            <Image src="/logo.png" width={80} height={80} alt="logo" />
            <nav className="flex">
              <ul className="flex flex-row my-auto gap-12 text-white">
                {navLinks?.map((link, index) => (
                  <li key={index}>
                    <Link href={link.path}>{link?.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex mt-24 flex-col gap-8">
          <div className="mx-auto w-56 h-56 rounded-full bg-gradient-to-r from-salmon from-20% via-electric-violet via-100%">
            <Image
              src="/avatar.png"
              alt="avatar"
              width={214}
              height={214}
              className="m-auto"
            />
          </div>
          <p className="text-5xl mx-auto text-white">I do code and make content about it!</p>
        </div>
      </div>
    </>
  );
};

export default Portifolio;
