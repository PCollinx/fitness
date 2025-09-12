import dynamic from "next/dynamic";

const BackNavigation = dynamic(
  () => import("../../components/BackNavigation"),
  { ssr: false }
);

const TimeSelection = dynamic(() => import("../../components/TimeSelection"), {
  ssr: false,
});

export default function TimeSelectionPage() {
  return (
    <>
      <BackNavigation title="Back to Mobile UI" />
      return <TimeSelection />;
    </>
  );
}
