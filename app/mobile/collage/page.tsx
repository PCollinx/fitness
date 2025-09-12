import dynamic from "next/dynamic";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const MobileUICollage = dynamic(
  () => import("../../components/MobileUICollage"),
  {
    ssr: false,
  }
);

export default function CollageView() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full bg-black/80 z-50 px-6 py-4 flex items-center">
        <Link
          href="/mobile"
          className="text-white hover:text-yellow-300 flex items-center gap-2 transition-colors"
        >
          <FaArrowLeft /> Back to Mobile UI
        </Link>
        <h1 className="text-white text-xl font-bold ml-6">
          My Trainer UI Components
        </h1>
      </div>
      <MobileUICollage />

      {/* Additional CSS for the collage view */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #2c2c2c;
        }
      `}</style>
    </>
  );
}
