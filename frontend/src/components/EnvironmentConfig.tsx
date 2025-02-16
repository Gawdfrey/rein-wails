import { useState, useEffect } from "react";
import { Environment, ModuleService } from "../../bindings/changeme";
import { Button, TextField, UNSTABLE_Select } from "@stacc/prism-ui";
import CodeMirror from "@uiw/react-codemirror";
import { yaml } from "@codemirror/lang-yaml";
import { oneDark } from "@codemirror/theme-one-dark";

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

type ViewMode = "form" | "code";

interface AddModuleModalProps {
  onClose: () => void;
  onAdd: (moduleId: string) => void;
}

function AddModuleModal({ onClose, onAdd }: AddModuleModalProps) {
  const [modules, setModules] = useState<Array<{ id: string; name: string }>>(
    []
  );
  const [selectedModule, setSelectedModule] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const availableModules = await ModuleService.GetModules();
        setModules(availableModules.map((m) => ({ id: m.id, name: m.name })));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch modules"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedModule) {
      onAdd(selectedModule);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Module</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="text-red-600 mb-4">{error}</div>
        ) : loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <UNSTABLE_Select
                label="Select Module"
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                options={modules.map((module) => ({
                  label: module.name,
                  value: module.id,
                }))}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} label="Cancel" />
              <Button
                type="submit"
                disabled={!selectedModule}
                label="Add Module"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

interface AddValueModalProps {
  onClose: () => void;
  onAdd: (key: string, value: string) => void;
}

function AddValueModal({ onClose, onAdd }: AddValueModalProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key && value) {
      onAdd(key, value);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Configuration Value</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <TextField
              label="Key"
              value={key}
              onChange={(value: string) => setKey(value)}
              placeholder="Enter configuration key"
              required
            />
            <TextField
              label="Value"
              value={value}
              onChange={(value: string) => setValue(value)}
              placeholder="Enter configuration value"
              required
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose} label="Cancel" />
            <Button type="submit" disabled={!key || !value} label="Add Value" />
          </div>
        </form>
      </div>
    </div>
  );
}

export function EnvironmentConfig({
  environment,
  onSave,
}: EnvironmentConfigProps) {
  const [config, setConfig] = useState<ConfigValues>(defaultConfig);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("form");
  const [editorContent, setEditorContent] = useState("");
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [showAddValueModal, setShowAddValueModal] = useState(false);
  const [selectedModuleName, setSelectedModuleName] = useState<string | null>(
    null
  );

  // Convert form values to YAML format
  const getYamlConfig = () => {
    return `apiVersion: environments.blocc.dev/v1beta1
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
  .filter(([, moduleConfig]) => moduleConfig.enabled)
  .map(
    ([moduleName, moduleConfig]) => `    ${moduleName}:
      values:
${Object.entries(moduleConfig.values)
  .map(([key, value]) => `        ${key}: ${value}`)
  .join("\n")}`
  )
  .join("\n")}`;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const configToSave =
        viewMode === "form" ? getYamlConfig() : editorContent;
      await onSave(configToSave);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save configuration:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddModule = (moduleId: string) => {
    setConfig((prev) => ({
      ...prev,
      moduleConfigs: {
        ...prev.moduleConfigs,
        [moduleId]: {
          enabled: true,
          values: {},
        },
      },
    }));
  };

  const handleAddValue = (key: string, value: string) => {
    if (selectedModuleName) {
      setConfig((prev) => ({
        ...prev,
        moduleConfigs: {
          ...prev.moduleConfigs,
          [selectedModuleName]: {
            ...prev.moduleConfigs[selectedModuleName],
            values: {
              ...prev.moduleConfigs[selectedModuleName].values,
              [key]: value,
            },
          },
        },
      }));
    }
  };

  const addModuleValue = (moduleName: string) => {
    setSelectedModuleName(moduleName);
    setShowAddValueModal(true);
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
              onClick={() => {
                setIsEditing(true);
                if (viewMode === "code") {
                  setEditorContent(getYamlConfig());
                }
              }}
              label="Edit Configuration"
            />
          )}
        </div>
      </div>

      {isEditing && (
        <div className="mb-6 flex gap-4 border-b">
          <button
            className={`px-4 py-2 font-medium ${
              viewMode === "form"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setViewMode("form")}
          >
            Form
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              viewMode === "code"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => {
              setViewMode("code");
              setEditorContent(getYamlConfig());
            }}
          >
            Code
          </button>
        </div>
      )}

      {viewMode === "form" ? (
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
                  onClick={() => {
                    setShowAddModuleModal(true);
                  }}
                  label="Add Module"
                  variant="outline"
                />
              )}
            </div>
            <div className="space-y-4">
              {Object.entries(config.moduleConfigs).map(
                ([moduleName, moduleConfig]) => (
                  <div
                    key={moduleName}
                    className="border rounded p-4 bg-gray-50"
                  >
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
      ) : (
        <div className="border rounded-lg p-4">
          <CodeMirror
            value={editorContent}
            onChange={(value) => setEditorContent(value)}
            extensions={[yaml()]}
            theme={oneDark}
            className="h-[300px] w-full"
          />
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        <h3 className="font-medium mb-2">Configuration Tips:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Choose a resource profile based on your environment's needs</li>
          <li>Set the domain suffix for your environment's services</li>
          <li>Enable or disable modules as needed</li>
          <li>Configure module-specific values using key-value pairs</li>
        </ul>
      </div>

      {showAddModuleModal && (
        <AddModuleModal
          onClose={() => setShowAddModuleModal(false)}
          onAdd={handleAddModule}
        />
      )}

      {showAddValueModal && selectedModuleName && (
        <AddValueModal
          onClose={() => {
            setShowAddValueModal(false);
            setSelectedModuleName(null);
          }}
          onAdd={handleAddValue}
        />
      )}
    </div>
  );
}
