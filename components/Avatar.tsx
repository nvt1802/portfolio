import Image from "next/image";

const Avatar = () => {
  return (
    <>
      <div className="mx-auto w-56 h-56 rounded-full bg-gradient-to-r from-salmon from-20% via-electric-violet via-100%">
        <Image
          src="/avatar.png"
          alt="avatar"
          width={214}
          height={214}
          className="m-auto"
        />
      </div>
    </>
  );
};

export default Avatar;
