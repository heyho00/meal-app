import React from "react";
import Link from "next/link";
import Image from "next/image";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-48 h-48 md:w-64 md:h-64 mb-4">
        {/* md:w-48 md:h-48를 추가하여 모바일 화면에서는 작은 크기로, 데스크톱 화면에서는 큰 크기로 표시 */}
        <Image
          src="/images/meal.png"
          width={300}
          height={300}
          alt="logo"
          className="rounded-full w-full h-full"
          priority
        />
      </div>
      <div className="mb-4 text-xl">머먹을까 !?</div>
      <Link href="/result">
        <button className="bg-pink-600 hover:bg-pink-800 text-white font-bold py-4 px-8 rounded text-xl">
          GO
        </button>
      </Link>
    </div>
  );
};

export default Home;
