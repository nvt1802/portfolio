import Image from "next/image";

const Avatar = () => {
  return (
    <>
      <div id="home" className="mx-auto w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-r from-salmon from-20% via-electric-violet via-100% flex">
        <Image
          src="/avatar.jpg"
          alt="avatar"
          width={160}
          height={160}
          className="m-auto rounded-full min-w-40 min-h-40 sm:min-w-52 sm:min-h-52 object-cover"
        />
      </div>
    </>
  );
};

export default Avatar;
