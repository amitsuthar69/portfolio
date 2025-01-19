"use client";

import Image from "next/image";

const Pattern = () => {
  return (
    <div className="h-40 bg-repeat bg-[#5BB2EC]">
      <Image
        src="/computer.png"
        alt="computer"
        className="h-24"
        height={96}
        width={96}
      />
    </div>
  );
};

export default Pattern;
