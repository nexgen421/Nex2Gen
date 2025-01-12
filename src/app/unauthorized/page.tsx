import React from "react";
import Image from 'next/image';

const unauthorized = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-12 py-8 ">
      <Image src="/403.svg" width={200} height={200} alt="403.svg" />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center text-3xl font-medium">
          You are not authorized
        </h1>
        <p className="text-center text-xl ">
          You tried to access a page you did not have prior authorization for.
        </p>
      </div>
    </div>
  );
};

export default unauthorized;
