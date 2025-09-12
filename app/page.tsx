import Link from "next/link";
import { FaDumbbell, FaChartLine, FaUsers, FaUtensils } from "react-icons/fa";

export default function Home() {
  return (
    <div className="font-sans overflow-hidden">
      {/* Added overflow-hidden to prevent horizontal scrolling from animations */}
      {/* Hero Section */}
      <section className="relative bg-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                Take Control of Your Fitness Journey
              </h1>
              <p className="text-xl mb-8 text-white">
                Track workouts, monitor progress, and connect with fitness
                enthusiasts all in one place.
              </p>
              <div className="space-x-4">
                <Link
                  href="/auth/signup"
                  className="bg-sky-500 text-white hover:bg-sky-600 px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 shadow-md"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-white text-blue-800 hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-lg transition-all duration-200 shadow-md"
                >
                  Log In
                </Link>
              </div>
            </div>
            <div className="hidden md:block slide-in-right">
              <div className="relative h-96 w-full">
                <div className="absolute inset-0 bg-white/20 rounded-lg overflow-hidden shadow-lg border border-white/30">
                  {/* This would be an actual image in a real app */}
                  <div className="flex items-center justify-center h-full text-8xl text-white">
                    <FaDumbbell />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl font-bold text-blue-900">
              Everything You Need to Reach Your Goals
            </h2>
            <p className="mt-4 text-xl text-gray-700">
              FitTrack provides all the tools you need to track your fitness
              journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-sky-500 text-4xl mb-4">
                <FaDumbbell />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">
                Workout Plans
              </h3>
              <p className="text-gray-700">
                Create custom workout routines or choose from our library of
                expert-designed plans.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-sky-500 text-4xl mb-4">
                <FaChartLine />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">
                Progress Tracking
              </h3>
              <p className="text-gray-700">
                Monitor your measurements, weight, and fitness achievements over
                time with detailed analytics.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-sky-500 text-4xl mb-4">
                <FaUtensils />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">
                Nutrition Tracking
              </h3>
              <p className="text-gray-700">
                Log your meals and track your macros to ensure you&apos;re
                fueling your body properly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-sky-500 text-4xl mb-4">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold mb-2 text-blue-800">
                Social Community
              </h3>
              <p className="text-gray-700">
                Connect with friends, share achievements, and stay motivated
                with our supportive community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl font-bold text-blue-900">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-gray-700">
              Join thousands of satisfied users who have transformed their
              fitness journey with FitTrack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold text-xl">
                  JD
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-blue-900">
                    John Doe
                  </h4>
                  <p className="text-gray-700">Fitness Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-800">
                &ldquo;FitTrack has completely transformed how I approach my
                fitness. The progress tracking features keep me motivated and
                the social aspect helps me stay accountable.&rdquo;
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xl">
                  JS
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-blue-900">
                    Jane Smith
                  </h4>
                  <p className="text-gray-700">Personal Trainer</p>
                </div>
              </div>
              <p className="text-gray-800">
                &ldquo;As a personal trainer, I recommend FitTrack to all my
                clients. It&apos;s intuitive, comprehensive, and makes tracking
                progress so much easier.&rdquo;
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xl">
                  MJ
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold text-blue-900">
                    Mike Johnson
                  </h4>
                  <p className="text-gray-700">Marathon Runner</p>
                </div>
              </div>
              <p className="text-gray-800">
                &ldquo;The workout planning and progress tracking in FitTrack
                helped me prepare for my first marathon. I couldn&apos;t have
                done it without this app!&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Fitness Journey?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of users who have already taken control of their
            fitness with FitTrack.
          </p>
          <Link
            href="/auth/signup"
            className="bg-white text-blue-800 hover:bg-gray-100 px-8 py-4 rounded-md font-medium text-lg inline-block transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}
