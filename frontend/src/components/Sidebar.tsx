import { Button } from "react-aria-components";
import { Link, useRouter } from "@tanstack/react-router";

export function Sidebar() {
  const router = useRouter();

  const isModulesPage =
    router.state.location.pathname === "/" ||
    router.state.location.pathname.startsWith("/modules");
  const isSolutionsPage =
    router.state.location.pathname.startsWith("/solutions");

  return (
    <div className="w-64 h-full max-w-64 min-h-screen bg-gray-100 p-4 border-r border-gray-200">
      <Link to="/" className="block mb-4">
        <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">
          Blocc
        </h2>
      </Link>
      <nav className="flex flex-col gap-2">
        <Link to="/modules" className="block">
          <Button
            className={`w-full text-left p-2 rounded hover:bg-gray-200 cursor-pointer ${
              isModulesPage ? "bg-gray-200" : ""
            }`}
          >
            Modules
          </Button>
        </Link>
        <Link to="/solutions" className="block">
          <Button
            className={`w-full text-left p-2 rounded hover:bg-gray-200 cursor-pointer ${
              isSolutionsPage ? "bg-gray-200" : ""
            }`}
          >
            Solutions
          </Button>
        </Link>
        <Link to="/settings" className="block">
          <Button
            className={`w-full text-left p-2 rounded hover:bg-gray-200 cursor-pointer ${
              router.state.location.pathname === "/settings"
                ? "bg-gray-200"
                : ""
            }`}
          >
            Settings
          </Button>
        </Link>
      </nav>
    </div>
  );
}
