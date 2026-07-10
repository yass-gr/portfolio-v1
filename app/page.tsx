import Model3D from "@/components/Model3D";
import AsciiHover from "@/components/AsciiHover";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center mx-4 xl:lg:-translate-y-10 lg:-translate-y-6 sm:-translate-y-4">
        <h1 className="mx-auto text-[12.5vw] font-clash-grotesk-bold">
          YASSINE GRAIRI
        </h1>
      </div>
      <div className="flex justify-center mt-8">
        <AsciiHover />
      </div>
      <Model3D />
    </main>
  );
}
