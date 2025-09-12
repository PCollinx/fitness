import dynamic from "next/dynamic";

const BackNavigation = dynamic(
  () => import("../../components/BackNavigation"),
  { ssr: false }
);

const WorkoutStreak = dynamic(() => import("../../components/WorkoutStreak"), {
  ssr: false,
});

export default function WorkoutStreakPage() {
  return (
    <>
      <BackNavigation title="Back to Mobile UI" />
      return <WorkoutStreak />;
    </>
  );
}
