import dynamic from "next/dynamic";

const FitnessGoals = dynamic(() => import("../../components/FitnessGoals"), {
  ssr: false,
});
const BackNavigation = dynamic(
  () => import("../../components/BackNavigation"),
  { ssr: false }
);

export default function FitnessGoalsPage() {
  return (
    <>
      <BackNavigation title="Back to Mobile UI" />
      <FitnessGoals />
    </>
  );
}
