import dynamic from "next/dynamic";

const BackNavigation = dynamic(
  () => import("../../components/BackNavigation"),
  { ssr: false }
);

export default function MealPlansPage() {
  return (
    <>
      <BackNavigation title="Back to Mobile UI" />
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Meal Plans</h1>
          <p className="text-gray-600">
            This component is currently under development. Stay tuned for meal planning features!
          </p>
        </div>
      </div>
    </>
  );
}
