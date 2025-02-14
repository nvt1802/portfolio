import Item from "@/components/Projects/Item";
import { projects } from "@/utils/constants/common";

const Projects = () => {
  return (
    <>
      <div className="mx-auto space-y-8 mt-8">
        <p className="uppercase bg-gradient-to-t from-orange-roughy from-20% via-salmon via-100% text-transparent bg-clip-text text-4xl text-center">
          Projects
        </p>
        <div className="flex flex-row gap-8">
          {projects?.map((item, index) => (
            <Item key={index} data={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
