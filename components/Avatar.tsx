import Image from "next/image";

const Avatar = () => {
  return (
    <>
      <div className="mx-auto w-56 h-56 rounded-full bg-gradient-to-r from-salmon from-20% via-electric-violet via-100% flex">
        <Image
          src="/avatar.jpg"
          alt="avatar"
          width={208}
          height={208}
          className="m-auto rounded-full min-w-52 min-h-52 object-cover"
        />
      </div>
    </>
  );
};

export default Avatar;
