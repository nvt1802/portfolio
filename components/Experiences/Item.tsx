import { IProjectExperience } from "@/types/common";
import Image from "next/image";

interface IProps {
  data: IProjectExperience;
}
const Item: React.FC<IProps> = ({ data }) => {
  return (
    <>
      <div className="space-y-6 max-w-3xl">
        <div className="flex flex-row justify-between">
          <div className="flex gap-3">
            {data?.icon && (
              <Image src={data?.icon} alt="" width={28} height={28} />
            )}
            <p className="text-white text-xl">{data?.name}</p>
          </div>
          <p className="text-regent-gray text-sm">{data?.date}</p>
        </div>
        <p className="text-base font-normal text-regent-gray">
          {data?.description}
        </p>
      </div>
    </>
  );
};

export default Item;
