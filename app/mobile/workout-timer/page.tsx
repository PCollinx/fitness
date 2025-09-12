import dynamic from "next/dynamic";

const WorkoutTimer = dynamic(() => import("../../components/WorkoutTimer"), {
  ssr: false,
});
const BackNavigation = dynamic(
  () => import("../../components/BackNavigation"),
  { ssr: false }
);

export default function WorkoutTimerPage() {
  return (
    <>
      <BackNavigation title="Back to Mobile UI" />
      <WorkoutTimer />
    </>
  );
}
