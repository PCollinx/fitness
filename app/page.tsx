import Link from "next/link";
import {
  FaDumbbell,
  FaChartLine,
  FaUtensils,
  FaClock,
  FaPlayCircle,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="font-sans">
      {/* Main Dashboard Grid */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Welcome Card */}
          <div className="md:col-span-8 bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Welcome back, Collins
              </h2>
              <span className="text-yellow-400">September 12, 2025</span>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-900 rounded-lg p-4 flex-1 min-w-[150px]">
                <div className="text-gray-400 mb-1">Streak</div>
                <div className="text-2xl font-bold text-white">7 Days</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 flex-1 min-w-[150px]">
                <div className="text-gray-400 mb-1">Calories Burned</div>
                <div className="text-2xl font-bold text-white">1,245 cal</div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 flex-1 min-w-[150px]">
                <div className="text-gray-400 mb-1">Workouts</div>
                <div className="text-2xl font-bold text-white">4 this week</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-white font-semibold mb-3">
                Upcoming Workouts
              </h3>
              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-lg font-medium text-white">
                      Upper Body Focus
                    </div>
                    <div className="text-gray-400 flex items-center mt-1">
                      <FaClock className="mr-1" /> 45 min •{" "}
                      <FaDumbbell className="mx-1" /> High intensity
                    </div>
                  </div>
                  <Link
                    href="/workouts/start"
                    className="flex items-center bg-yellow-400 text-black rounded-full py-2 px-4 font-medium hover:bg-yellow-300 transition"
                  >
                    <FaPlayCircle className="mr-2" /> Start
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Workout Timer */}
          <div className="md:col-span-4 bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">Quick Timer</h2>
            <div className="bg-gray-900 rounded-lg p-6 flex-grow flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-white mb-6">00:00:00</div>
              <div className="flex space-x-4">
                <button className="bg-gray-700 p-3 rounded-full text-white hover:bg-gray-600 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <button className="bg-yellow-400 p-4 rounded-full text-black hover:bg-yellow-300 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button className="bg-gray-700 p-3 rounded-full text-white hover:bg-gray-600 transition">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Workout Categories */}
          <div className="md:col-span-6 bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Workout Types</h2>
              <Link
                href="/workouts"
                className="text-yellow-400 hover:underline flex items-center"
              >
                See all <FaArrowRight className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/workouts/strength"
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-700 transition"
              >
                <div className="text-yellow-400 text-3xl mb-3">
                  <FaDumbbell />
                </div>
                <h3 className="font-medium text-white">Strength</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Build muscle & power
                </p>
              </Link>

              <Link
                href="/workouts/cardio"
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-700 transition"
              >
                <div className="text-yellow-400 text-3xl mb-3">
                  <FaChartLine />
                </div>
                <h3 className="font-medium text-white">Cardio</h3>
                <p className="text-gray-400 text-sm mt-1">Improve endurance</p>
              </Link>

              <Link
                href="/workouts/flexibility"
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-700 transition"
              >
                <div className="text-yellow-400 text-3xl mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
                <h3 className="font-medium text-white">Flexibility</h3>
                <p className="text-gray-400 text-sm mt-1">Enhance mobility</p>
              </Link>

              <Link
                href="/workouts/create"
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-700 transition border border-dashed border-gray-700 flex items-center justify-center flex-col"
              >
                <div className="text-yellow-400 text-3xl mb-2">
                  <FaPlus />
                </div>
                <h3 className="font-medium text-white">Custom</h3>
              </Link>
            </div>
          </div>

          {/* Meal Prep */}
          <div className="md:col-span-6 bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Meal Plans</h2>
              <Link
                href="/nutrition"
                className="text-yellow-400 hover:underline flex items-center"
              >
                See all <FaArrowRight className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-800 relative">
                  <img
                    src="https://source.unsplash.com/random/400x200/?eggs,avocado,toast"
                    alt="Breakfast"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">
                        Eggs and avocado toast
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">420 calories</p>
                    </div>
                    <div className="bg-yellow-400 text-xs text-black font-medium px-2 py-1 rounded">
                      Breakfast
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-800 relative">
                  <img
                    src="https://source.unsplash.com/random/400x200/?smoothie,berries"
                    alt="Smoothie"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">
                        Protein smoothie
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">320 calories</p>
                    </div>
                    <div className="bg-yellow-400 text-xs text-black font-medium px-2 py-1 rounded">
                      Snack
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Muscle Targeting */}
          <div className="md:col-span-6 bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">
              Target Muscle Groups
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                "Chest",
                "Back",
                "Shoulders",
                "Biceps",
                "Triceps",
                "Abs",
                "Legs",
                "Glutes",
                "Calves",
              ].map((muscle) => (
                <button
                  key={muscle}
                  className="bg-gray-900 hover:bg-gray-700 py-3 px-1 rounded-lg text-white transition"
                >
                  {muscle}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="md:col-span-6 bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4">
              Time to stay fit
            </h2>
            <p className="text-gray-400 mb-4">
              How much time do you have for your workout?
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[15, 30, 45, 60].map((time) => (
                <button
                  key={time}
                  className="bg-gray-900 hover:bg-gray-700 py-4 px-4 rounded-lg text-white transition"
                >
                  <div className="text-xl font-bold">{time}</div>
                  <div className="text-gray-400 text-sm">minutes</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
