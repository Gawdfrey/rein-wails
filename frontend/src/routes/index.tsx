import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <div className="relative py-20 px-8">
        <div className="absolute inset-0 bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]" />
        <div className="relative z-10 max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Welcome to Blocc UI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Your centralized platform for managing infrastructure modules and
            solutions. Deploy, monitor, and scale with confidence.
          </p>
          <Link
            to="/modules"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Explore Modules
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto py-16 px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          Everything you need to manage your infrastructure
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Module Management */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Module Management
            </h3>
            <p className="text-gray-600 mb-4">
              Browse, install, and manage infrastructure modules with ease.
            </p>
            <Link
              to="/modules"
              className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              View Modules
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Solution Management */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Solution Management
            </h3>
            <p className="text-gray-600 mb-4">
              Create and manage customer solutions with multiple environments.
            </p>
            <Link
              to="/solutions"
              className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
            >
              View Solutions
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          {/* Environment Management */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Environment Management
            </h3>
            <p className="text-gray-600 mb-4">
              Deploy and monitor your infrastructure across different
              environments.
            </p>
            <Link
              to="/settings"
              className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center"
            >
              View Settings
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
              <div className="text-gray-600">Available Modules</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">2</div>
              <div className="text-gray-600">Active Solutions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-gray-600">Environments</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
