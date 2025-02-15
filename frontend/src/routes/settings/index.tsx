import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckboxGroup } from "@stacc/prism-ui";
import { queries } from "../../queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/settings/")({
  component: Settings,
  loader({ context: { queryClient } }) {
    queryClient.ensureQueryData(queries.getSystemInfo());
  },
});

export function Settings() {
  const systemInfoQuery = useSuspenseQuery(queries.getSystemInfo());
  const systemInfo = systemInfoQuery.data;
  const appInfo = {
    version: "v0.0.1",
    name: "Blocc UI",
    copyright: "© 2025 Stacc",
  };

  const [settings, setSettings] = useState({
    autoUpdate: true,
    showDevEnvironments: true,
    experimentalFeatures: false,
  });

  const handleSettingChange =
    (key: keyof typeof settings) => (value: string | boolean) => {
      setSettings((prev) => ({ ...prev, [key]: Boolean(value) }));
    };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
      <div className="grid grid-cols-2 gap-8">
        {/* Application Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Application Information
          </h2>
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Version</h3>
              <p className="text-base text-gray-900">{appInfo.version}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Product Name
              </h3>
              <p className="text-base text-gray-900">{appInfo.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Copyright</h3>
              <p className="text-base text-gray-900">{appInfo.copyright}</p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            System Information
          </h2>
          <div className="grid gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Operating System
              </h3>
              <p className="text-base text-gray-900">
                {systemInfo?.operatingSystem || "Loading..."}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Shell</h3>
              <p className="text-base text-gray-900">
                {systemInfo?.shell || "Loading..."}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Architecture
              </h3>
              <p className="text-base text-gray-900">
                {systemInfo?.architecture || "Loading..."}
              </p>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <CheckboxGroup
            name="configuration"
            label="Configuration"
            options={[
              {
                label: "Auto-update modules",
                value: "autoUpdate",
              },
              {
                label: "Show development environments",
                value: "showDevEnvironments",
              },
              {
                label: "Enable experimental features",
                value: "experimentalFeatures",
              },
            ]}
            description="Automatically update modules when new versions are available"
            value={settings.autoUpdate}
            onChange={handleSettingChange("autoUpdate")}
          />
        </div>
      </div>
    </div>
  );
}
