import dynamic from "next/dynamic";

const MealPrep = dynamic(() => import("../../components/MealPrep"), {
  ssr: false,
});
const BackNavigation = dynamic(
  () => import("../../components/BackNavigation"),
  { ssr: false }
);

export default function MealPrepPage() {
  return (
    <>
      <BackNavigation title="Back to Mobile UI" />
      <MealPrep />
    </>
  );
}
