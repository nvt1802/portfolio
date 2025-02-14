import Item from "@/components/Experiences/Item";
import { projectExperiences } from "@/utils/constants/common";

const Experiences = () => {
  return (
    <>
      <div className="mx-auto mt-8">
        <p className="text-4xl bg-gradient-to-t from-denim from-20% via-malibu via-100% text-transparent bg-clip-text text-center">
          Experience
        </p>
        <div className="flex flex-col gap-12 mt-14">
          {projectExperiences?.map((item, index) => (
            <Item key={index} data={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Experiences;
