import dynamic from "next/dynamic";

const BackNavigation = dynamic(
  () => import("../../components/BackNavigation"),
  { ssr: false }
);

const WorkoutMusic = dynamic(() => import("../../components/WorkoutMusic"), {
  ssr: false,
});

export default function WorkoutMusicPage() {
  return (
    <>
      <BackNavigation title="Back to Mobile UI" />
      return <WorkoutMusic />;
    </>
  );
}
