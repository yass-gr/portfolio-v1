import Model3D from "@/components/Model3D";
import DissolveHover from "@/components/DissolveHover";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center mx-4 xl:lg:-translate-y-10 lg:-translate-y-6 sm:-translate-y-4">
        <h1 className="mx-auto text-[12.5vw] font-clash-grotesk-bold">
          YASSINE GRAIRI
        </h1>
      </div>
      <div className="ml-4 mt-8">
        <DissolveHover />
      </div>
      <Model3D />
    </main>
  );
}
