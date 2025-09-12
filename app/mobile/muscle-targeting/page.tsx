import dynamic from "next/dynamic";

const BackNavigation = dynamic(
  () => import("../../components/BackNavigation"),
  { ssr: false }
);

const MuscleTargeting = dynamic(
  () => import("../../components/MuscleTargeting"),
  { ssr: false }
);

export default function MuscleTargetingPage() {
  return (
    <>
      <BackNavigation title="Back to Mobile UI" />
      return <MuscleTargeting />;
    </>
  );
}
