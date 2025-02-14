import { IProject } from "@/types/common";
import Image from "next/image";

interface IProps {
  data: IProject;
}

const Item: React.FC<IProps> = ({ data }) => {
  return (
    <>
      <div className="rounded-[18px] w-full max-w-[390px] h-full max-h-[300px] rounded-t-[18px]">
        <Image
          src={data.thumbnail}
          alt={data.name}
          className="w-full h-[235px] rounded-t-[18px]"
          width={600}
          height={600}
        />
        <div className="rounded-b-[18px] w-full h-full text-secondary font-extrabold flex flex-row justify-between px-6 py-3">
          <div>
            <p className="text-[10px] leading-[19px]">CLICK HERE TO VISIT</p>
            <p className="text-lg text-white uppercase">{data.name}</p>
          </div>
          <Image src="/icons/view-icon.svg" alt="" width={14} height={14} />
        </div>
      </div>
    </>
  );
};

export default Item;
