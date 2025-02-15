import { useState } from "react";
import { Environment } from "../../bindings/changeme";
import { Button, TextField, UNSTABLE_Select } from "@stacc/prism-ui";

interface EnvironmentConfigProps {
  environment: Environment;
  solutionId: string;
  onSave: (config: string) => Promise<void>;
}

interface ConfigValues {
  resourceProfile: string;
  domainSuffix: string;
  moduleConfigs: {
    [key: string]: {
      enabled: boolean;
      values: { [key: string]: string };
    };
  };
}

const defaultConfig: ConfigValues = {
  resourceProfile: "small",
  domainSuffix: "services.stacc.dev",
  moduleConfigs: {},
};

export function EnvironmentConfig({
  environment,
  onSave,
}: EnvironmentConfigProps) {
  const [config, setConfig] = useState<ConfigValues>(defaultConfig);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Convert form values back to YAML format
      const yamlConfig = `apiVersion: environments.blocc.dev/v1beta1
kind: Development
metadata:
  name: "${environment.name}"
spec:
  resourceProfile: ${config.resourceProfile}
  global:
    values:
      domainSuffix: ${config.domainSuffix}
    valuesFrom: {}
  modules:
${Object.entries(config.moduleConfigs)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .filter(([_, moduleConfig]) => moduleConfig.enabled)
  .map(
    ([moduleName, moduleConfig]) => `    ${moduleName}:
      values:
${Object.entries(moduleConfig.values)
  .map(([key, value]) => `        ${key}: ${value}`)
  .join("\n")}`
  )
  .join("\n")}`;

      await onSave(yamlConfig);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save configuration:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const addModuleConfig = () => {
    const moduleName = prompt("Enter module name:");
    if (moduleName) {
      setConfig((prev) => ({
        ...prev,
        moduleConfigs: {
          ...prev.moduleConfigs,
          [moduleName]: {
            enabled: true,
            values: {},
          },
        },
      }));
    }
  };

  const addModuleValue = (moduleName: string) => {
    const key = prompt("Enter configuration key:");
    if (key) {
      const value = prompt(`Enter value for ${key}:`);
      if (value) {
        setConfig((prev) => ({
          ...prev,
          moduleConfigs: {
            ...prev.moduleConfigs,
            [moduleName]: {
              ...prev.moduleConfigs[moduleName],
              values: {
                ...prev.moduleConfigs[moduleName].values,
                [key]: value,
              },
            },
          },
        }));
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Environment Configuration
          </h2>
          <p className="text-gray-600 mt-1">
            Configure settings for {environment.name}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                label="Cancel"
              />
              <Button
                onClick={handleSave}
                disabled={isSaving}
                label={isSaving ? "Saving..." : "Save Changes"}
              />
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              label="Edit Configuration"
            />
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">General Settings</h3>
          <div className="space-y-4">
            <UNSTABLE_Select
              name="resourceProfile"
              label="Resource Profile"
              value={config.resourceProfile}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  resourceProfile: e.target.value,
                }))
              }
              options={[
                {
                  label: "Small",
                  value: "small",
                },
                {
                  label: "Medium",
                  value: "medium",
                },
                {
                  label: "Large",
                  value: "large",
                },
              ]}
              disabled={!isEditing}
            />
            <TextField
              name="domainSuffix"
              label="Domain Suffix"
              value={config.domainSuffix}
              onChange={(value: string) =>
                setConfig((prev) => ({
                  ...prev,
                  domainSuffix: value,
                }))
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Module Configurations</h3>
            {isEditing && (
              <Button
                onClick={addModuleConfig}
                label="Add Module"
                variant="outline"
              />
            )}
          </div>
          <div className="space-y-4">
            {Object.entries(config.moduleConfigs).map(
              ([moduleName, moduleConfig]) => (
                <div key={moduleName} className="border rounded p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={moduleConfig.enabled}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            moduleConfigs: {
                              ...prev.moduleConfigs,
                              [moduleName]: {
                                ...moduleConfig,
                                enabled: e.target.checked,
                              },
                            },
                          }))
                        }
                        disabled={!isEditing}
                        className="h-4 w-4"
                      />
                      <h4 className="font-medium">{moduleName}</h4>
                    </div>
                    {isEditing && moduleConfig.enabled && (
                      <Button
                        onClick={() => addModuleValue(moduleName)}
                        label="Add Value"
                        variant="outline"
                      />
                    )}
                  </div>
                  {moduleConfig.enabled && (
                    <div className="space-y-2 mt-2">
                      {Object.entries(moduleConfig.values).map(
                        ([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <input
                              type="text"
                              value={key}
                              disabled
                              className="w-1/3 p-2 border rounded bg-gray-100"
                            />
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                setConfig((prev) => ({
                                  ...prev,
                                  moduleConfigs: {
                                    ...prev.moduleConfigs,
                                    [moduleName]: {
                                      ...moduleConfig,
                                      values: {
                                        ...moduleConfig.values,
                                        [key]: e.target.value,
                                      },
                                    },
                                  },
                                }))
                              }
                              disabled={!isEditing}
                              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <h3 className="font-medium mb-2">Configuration Tips:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Choose a resource profile based on your environment's needs</li>
          <li>Set the domain suffix for your environment's services</li>
          <li>Enable or disable modules as needed</li>
          <li>Configure module-specific values using key-value pairs</li>
        </ul>
      </div>
    </div>
  );
}
