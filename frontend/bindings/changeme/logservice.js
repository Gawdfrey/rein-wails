// @ts-check
// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unused imports
import {Call as $Call, Create as $Create} from "@wailsio/runtime";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Unused imports
import * as $models from "./models.js";

/**
 * GetComponentLogs returns logs for a specific component in an environment
 * @param {string} solutionId
 * @param {string} environmentId
 * @param {string} componentId
 * @returns {Promise<$models.LogEntry[]> & { cancel(): void }}
 */
export function GetComponentLogs(solutionId, environmentId, componentId) {
    let $resultPromise = /** @type {any} */($Call.ByID(836198639, solutionId, environmentId, componentId));
    let $typingPromise = /** @type {any} */($resultPromise.then(($result) => {
        return $$createType1($result);
    }));
    $typingPromise.cancel = $resultPromise.cancel.bind($resultPromise);
    return $typingPromise;
}

/**
 * StreamComponentLogs would be used for real-time log streaming
 * This would be implemented with WebSocket in a real application
 * @param {string} solutionId
 * @param {string} environmentId
 * @param {string} componentId
 * @returns {Promise<void> & { cancel(): void }}
 */
export function StreamComponentLogs(solutionId, environmentId, componentId) {
    let $resultPromise = /** @type {any} */($Call.ByID(3978432697, solutionId, environmentId, componentId));
    return $resultPromise;
}

// Private type creation functions
const $$createType0 = $models.LogEntry.createFrom;
const $$createType1 = $Create.Array($$createType0);
