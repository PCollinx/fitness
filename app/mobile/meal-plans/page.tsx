import dynamic from "next/dynamic";

const BackNavigation = dynamic(
  () => import("../../components/BackNavigation"),
  { ssr: false }
);

const MealPlans = dynamic(() => import("../../components/MealPlans"), {
  ssr: false,
});

export default function MealPlansPage() {
  return (
    <>
      <BackNavigation title="Back to Mobile UI" />
      return <MealPlans />;
    </>
  );
}
