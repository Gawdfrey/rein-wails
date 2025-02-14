import { Button } from "react-aria-components";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();
  const isModulesPage =
    location.pathname === "/" || location.pathname.startsWith("/modules");

  return (
    <div className="w-64 h-full bg-gray-100 p-4 border-r border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Blocc</h2>
      <nav>
        <Link to="/">
          <Button
            className={`w-full text-left p-2 rounded hover:bg-gray-200 mb-2 ${
              isModulesPage ? "bg-gray-200" : ""
            }`}
          >
            Modules
          </Button>
        </Link>
        <Link to="/settings">
          <Button
            className={`w-full text-left p-2 rounded hover:bg-gray-200 mb-2 ${
              location.pathname === "/settings" ? "bg-gray-200" : ""
            }`}
          >
            Settings
          </Button>
        </Link>
      </nav>
    </div>
  );
}
