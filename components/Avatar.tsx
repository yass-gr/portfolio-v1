"use client";

export default function Avatar() {
  return (
    <div className=" mx-auto  w-[clamp(100px,15vw,200px)]  aspect-square overflow-hidden rounded-full border-2 border-neutral-900 dark:border-white">
      <img
        src="/pic1.png"
        alt="Yassine Grairi"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
