// @ts-check
// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unused imports
import {Create as $Create} from "@wailsio/runtime";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unused imports
import * as time$0 from "../time/models.js";

export class AddEnvironmentRequest {
    /**
     * Creates a new AddEnvironmentRequest instance.
     * @param {Partial<AddEnvironmentRequest>} [$$source = {}] - The source object to create the AddEnvironmentRequest.
     */
    constructor($$source = {}) {
        if (!("name" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["name"] = "";
        }
        if (!("namespace" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["namespace"] = "";
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new AddEnvironmentRequest instance from a string or object.
     * @param {any} [$$source = {}]
     * @returns {AddEnvironmentRequest}
     */
    static createFrom($$source = {}) {
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        return new AddEnvironmentRequest(/** @type {Partial<AddEnvironmentRequest>} */($$parsedSource));
    }
}

/**
 * @readonly
 * @enum {string}
 */
export const ComponentType = {
    /**
     * The Go zero value for the underlying type of the enum.
     */
    $zero: "",

    ComponentTypeBackend: "Backend",
    ComponentTypeFrontend: "Frontend",
    ComponentTypeApiGateway: "ApiGateway",
    ComponentTypeSetup: "Setup",
};

export class Environment {
    /**
     * Creates a new Environment instance.
     * @param {Partial<Environment>} [$$source = {}] - The source object to create the Environment.
     */
    constructor($$source = {}) {
        if (!("id" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["id"] = "";
        }
        if (!("name" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["name"] = "";
        }
        if (!("namespace" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["namespace"] = "";
        }
        if (!("status" in $$source)) {
            /**
             * @member
             * @type {EnvironmentStatus}
             */
            this["status"] = (/** @type {EnvironmentStatus} */(""));
        }
        if (!("lastDeployed" in $$source)) {
            /**
             * @member
             * @type {time$0.Time}
             */
            this["lastDeployed"] = null;
        }
        if (!("modules" in $$source)) {
            /**
             * @member
             * @type {EnvironmentModule[]}
             */
            this["modules"] = [];
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new Environment instance from a string or object.
     * @param {any} [$$source = {}]
     * @returns {Environment}
     */
    static createFrom($$source = {}) {
        const $$createField5_0 = $$createType1;
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        if ("modules" in $$parsedSource) {
            $$parsedSource["modules"] = $$createField5_0($$parsedSource["modules"]);
        }
        return new Environment(/** @type {Partial<Environment>} */($$parsedSource));
    }
}

export class EnvironmentModule {
    /**
     * Creates a new EnvironmentModule instance.
     * @param {Partial<EnvironmentModule>} [$$source = {}] - The source object to create the EnvironmentModule.
     */
    constructor($$source = {}) {
        if (!("moduleId" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["moduleId"] = "";
        }
        if (!("version" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["version"] = "";
        }
        if (!("status" in $$source)) {
            /**
             * @member
             * @type {EnvironmentStatus}
             */
            this["status"] = (/** @type {EnvironmentStatus} */(""));
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new EnvironmentModule instance from a string or object.
     * @param {any} [$$source = {}]
     * @returns {EnvironmentModule}
     */
    static createFrom($$source = {}) {
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        return new EnvironmentModule(/** @type {Partial<EnvironmentModule>} */($$parsedSource));
    }
}

/**
 * @readonly
 * @enum {string}
 */
export const EnvironmentStatus = {
    /**
     * The Go zero value for the underlying type of the enum.
     */
    $zero: "",

    EnvironmentStatusRunning: "running",
    EnvironmentStatusStopped: "stopped",
    EnvironmentStatusError: "error",
};

export class ModuleAttributes {
    /**
     * Creates a new ModuleAttributes instance.
     * @param {Partial<ModuleAttributes>} [$$source = {}] - The source object to create the ModuleAttributes.
     */
    constructor($$source = {}) {
        if (/** @type {any} */(false)) {
            /**
             * @member
             * @type {string | undefined}
             */
            this["githubRepo"] = "";
        }
        if (/** @type {any} */(false)) {
            /**
             * @member
             * @type {string | undefined}
             */
            this["documentation"] = "";
        }
        if (/** @type {any} */(false)) {
            /**
             * @member
             * @type {string | undefined}
             */
            this["website"] = "";
        }
        if (/** @type {any} */(false)) {
            /**
             * @member
             * @type {string | undefined}
             */
            this["license"] = "";
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new ModuleAttributes instance from a string or object.
     * @param {any} [$$source = {}]
     * @returns {ModuleAttributes}
     */
    static createFrom($$source = {}) {
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        return new ModuleAttributes(/** @type {Partial<ModuleAttributes>} */($$parsedSource));
    }
}

export class ModuleComponent {
    /**
     * Creates a new ModuleComponent instance.
     * @param {Partial<ModuleComponent>} [$$source = {}] - The source object to create the ModuleComponent.
     */
    constructor($$source = {}) {
        if (!("id" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["id"] = "";
        }
        if (!("name" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["name"] = "";
        }
        if (!("type" in $$source)) {
            /**
             * @member
             * @type {ComponentType}
             */
            this["type"] = (/** @type {ComponentType} */(""));
        }
        if (!("description" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["description"] = "";
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new ModuleComponent instance from a string or object.
     * @param {any} [$$source = {}]
     * @returns {ModuleComponent}
     */
    static createFrom($$source = {}) {
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        return new ModuleComponent(/** @type {Partial<ModuleComponent>} */($$parsedSource));
    }
}

export class ModuleDependency {
    /**
     * Creates a new ModuleDependency instance.
     * @param {Partial<ModuleDependency>} [$$source = {}] - The source object to create the ModuleDependency.
     */
    constructor($$source = {}) {
        if (!("id" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["id"] = "";
        }
        if (!("name" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["name"] = "";
        }
        if (!("version" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["version"] = "";
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new ModuleDependency instance from a string or object.
     * @param {any} [$$source = {}]
     * @returns {ModuleDependency}
     */
    static createFrom($$source = {}) {
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        return new ModuleDependency(/** @type {Partial<ModuleDependency>} */($$parsedSource));
    }
}

/**
 * ModuleResponse is used for API responses to ensure consistent JSON serialization
 */
export class ModuleResponse {
    /**
     * Creates a new ModuleResponse instance.
     * @param {Partial<ModuleResponse>} [$$source = {}] - The source object to create the ModuleResponse.
     */
    constructor($$source = {}) {
        if (!("id" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["id"] = "";
        }
        if (!("name" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["name"] = "";
        }
        if (!("description" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["description"] = "";
        }
        if (!("lastUpdated" in $$source)) {
            /**
             * ISO date string
             * @member
             * @type {string}
             */
            this["lastUpdated"] = "";
        }
        if (!("tags" in $$source)) {
            /**
             * @member
             * @type {string[]}
             */
            this["tags"] = [];
        }
        if (!("version" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["version"] = "";
        }
        if (!("installCommand" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["installCommand"] = "";
        }
        if (!("maintainer" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["maintainer"] = "";
        }
        if (!("dependencies" in $$source)) {
            /**
             * @member
             * @type {ModuleDependency[]}
             */
            this["dependencies"] = [];
        }
        if (!("attributes" in $$source)) {
            /**
             * @member
             * @type {ModuleAttributes}
             */
            this["attributes"] = (new ModuleAttributes());
        }
        if (!("components" in $$source)) {
            /**
             * @member
             * @type {ModuleComponent[]}
             */
            this["components"] = [];
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new ModuleResponse instance from a string or object.
     * @param {any} [$$source = {}]
     * @returns {ModuleResponse}
     */
    static createFrom($$source = {}) {
        const $$createField4_0 = $$createType2;
        const $$createField8_0 = $$createType4;
        const $$createField9_0 = $$createType5;
        const $$createField10_0 = $$createType7;
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        if ("tags" in $$parsedSource) {
            $$parsedSource["tags"] = $$createField4_0($$parsedSource["tags"]);
        }
        if ("dependencies" in $$parsedSource) {
            $$parsedSource["dependencies"] = $$createField8_0($$parsedSource["dependencies"]);
        }
        if ("attributes" in $$parsedSource) {
            $$parsedSource["attributes"] = $$createField9_0($$parsedSource["attributes"]);
        }
        if ("components" in $$parsedSource) {
            $$parsedSource["components"] = $$createField10_0($$parsedSource["components"]);
        }
        return new ModuleResponse(/** @type {Partial<ModuleResponse>} */($$parsedSource));
    }
}

export class Solution {
    /**
     * Creates a new Solution instance.
     * @param {Partial<Solution>} [$$source = {}] - The source object to create the Solution.
     */
    constructor($$source = {}) {
        if (!("id" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["id"] = "";
        }
        if (!("name" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["name"] = "";
        }
        if (!("description" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["description"] = "";
        }
        if (!("customer" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["customer"] = "";
        }
        if (!("createdAt" in $$source)) {
            /**
             * @member
             * @type {time$0.Time}
             */
            this["createdAt"] = null;
        }
        if (!("updatedAt" in $$source)) {
            /**
             * @member
             * @type {time$0.Time}
             */
            this["updatedAt"] = null;
        }
        if (!("modules" in $$source)) {
            /**
             * @member
             * @type {SolutionModule[]}
             */
            this["modules"] = [];
        }
        if (!("environments" in $$source)) {
            /**
             * @member
             * @type {Environment[]}
             */
            this["environments"] = [];
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new Solution instance from a string or object.
     * @param {any} [$$source = {}]
     * @returns {Solution}
     */
    static createFrom($$source = {}) {
        const $$createField6_0 = $$createType9;
        const $$createField7_0 = $$createType11;
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        if ("modules" in $$parsedSource) {
            $$parsedSource["modules"] = $$createField6_0($$parsedSource["modules"]);
        }
        if ("environments" in $$parsedSource) {
            $$parsedSource["environments"] = $$createField7_0($$parsedSource["environments"]);
        }
        return new Solution(/** @type {Partial<Solution>} */($$parsedSource));
    }
}

export class SolutionModule {
    /**
     * Creates a new SolutionModule instance.
     * @param {Partial<SolutionModule>} [$$source = {}] - The source object to create the SolutionModule.
     */
    constructor($$source = {}) {
        if (!("moduleId" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["moduleId"] = "";
        }
        if (!("version" in $$source)) {
            /**
             * @member
             * @type {string}
             */
            this["version"] = "";
        }

        Object.assign(this, $$source);
    }

    /**
     * Creates a new SolutionModule instance from a string or object.
     * @param {any} [$$source = {}]
     * @returns {SolutionModule}
     */
    static createFrom($$source = {}) {
        let $$parsedSource = typeof $$source === 'string' ? JSON.parse($$source) : $$source;
        return new SolutionModule(/** @type {Partial<SolutionModule>} */($$parsedSource));
    }
}

// Private type creation functions
const $$createType0 = EnvironmentModule.createFrom;
const $$createType1 = $Create.Array($$createType0);
const $$createType2 = $Create.Array($Create.Any);
const $$createType3 = ModuleDependency.createFrom;
const $$createType4 = $Create.Array($$createType3);
const $$createType5 = ModuleAttributes.createFrom;
const $$createType6 = ModuleComponent.createFrom;
const $$createType7 = $Create.Array($$createType6);
const $$createType8 = SolutionModule.createFrom;
const $$createType9 = $Create.Array($$createType8);
const $$createType10 = Environment.createFrom;
const $$createType11 = $Create.Array($$createType10);
