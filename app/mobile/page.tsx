import dynamic from "next/dynamic";
import { Suspense } from "react";
import Link from "next/link";

// This ensures client components don't break during SSR
const WorkoutTimer = dynamic(() => import("../components/WorkoutTimer"), {
  ssr: false,
});
const FitnessGoals = dynamic(() => import("../components/FitnessGoals"), {
  ssr: false,
});
const MuscleTargeting = dynamic(() => import("../components/MuscleTargeting"), {
  ssr: false,
});
const WorkoutStreak = dynamic(() => import("../components/WorkoutStreak"), {
  ssr: false,
});
const TimeSelection = dynamic(() => import("../components/TimeSelection"), {
  ssr: false,
});
const WorkoutMusic = dynamic(() => import("../components/WorkoutMusic"), {
  ssr: false,
});

export default function Mobile() {
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modern Fitness Mobile UI
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Explore our new mobile-first interface components designed for an
            optimal user experience
          </p>
          <Link
            href="/mobile/collage"
            className="inline-block bg-blue-800 text-white hover:bg-blue-700 px-6 py-3 rounded-md font-medium transition-all duration-200 shadow-md"
          >
            View as Figma-style Collage
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Component Previews */}
          {[
            {
              title: "Workout Timer",
              description:
                "Track your workout sessions with an elegant timer interface",
              component: <WorkoutTimer />,
              path: "/mobile/workout-timer",
            },
            {
              title: "Fitness Goals",
              description:
                "Set and track your fitness objectives with clear categorization",
              component: <FitnessGoals />,
              path: "/mobile/fitness-goals",
            },
            {
              title: "Muscle Targeting",
              description:
                "Specifically target the muscle groups you want to work on",
              component: <MuscleTargeting />,
              path: "/mobile/muscle-targeting",
            },
            {
              title: "Workout Streak",
              description:
                "Stay motivated with workout streak tracking and celebrations",
              component: <WorkoutStreak />,
              path: "/mobile/workout-streak",
            },
            {
              title: "Workout Schedule",
              description: "Set your preferred workout times and get reminders",
              component: <TimeSelection />,
              path: "/mobile/time-selection",
            },
            {
              title: "Workout Music",
              description:
                "Integrate your favorite music with your workout routine",
              component: <WorkoutMusic />,
              path: "/mobile/workout-music",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Link
                  href={item.path}
                  className="inline-block bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  View Component
                </Link>
              </div>

              <div className="mt-4 border-t border-gray-200 p-4">
                <div className="h-96 overflow-hidden rounded-lg border border-gray-200">
                  <div className="transform scale-[0.7] origin-top">
                    <div className="max-w-[375px] mx-auto">
                      <Suspense
                        fallback={
                          <div className="h-full w-full flex items-center justify-center">
                            Loading...
                          </div>
                        }
                      >
                        {item.component}
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
