import { experienceIcons } from "@/utils/constants/common";
import Image from "next/image";

const Experiences = () => {
  return (
    <>
      <div className="mx-auto mt-8">
        <p className="text-secondary font-semibold text-xl">EXPERIENCE WITH</p>
      </div>

      <div className="flex flex-row gap-8 mx-auto mt-8">
        {experienceIcons?.map((item, index) => (
          <Image
            key={index}
            src={item?.icon}
            alt=""
            width={42}
            height={42}
            title={item?.name}
          />
        ))}
      </div>
    </>
  );
};

export default Experiences;
