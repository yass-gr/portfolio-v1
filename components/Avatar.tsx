"use client";

export default function Avatar() {
  return (
    <div className=" mx-auto  w-[clamp(100px,18vw,280px)]  aspect-square overflow-hidden rounded-full border-2 border-neutral-900 dark:border-white">
      <img
        src="/avatar.jpeg"
        alt="Yassine Grairi"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
