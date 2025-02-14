"use client";

import { navLinks } from "@/utils/constants/common";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <>
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
    </>
  );
};

export default Header;
