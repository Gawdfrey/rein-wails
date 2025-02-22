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
 * @param {string} id
 * @returns {Promise<$models.ModuleResponse | null> & { cancel(): void }}
 */
export function GetModule(id) {
    let $resultPromise = /** @type {any} */($Call.ByID(1305056591, id));
    let $typingPromise = /** @type {any} */($resultPromise.then(($result) => {
        return $$createType1($result);
    }));
    $typingPromise.cancel = $resultPromise.cancel.bind($resultPromise);
    return $typingPromise;
}

/**
 * GetModuleReadme fetches the README content from GitHub if available
 * @param {string} id
 * @returns {Promise<string> & { cancel(): void }}
 */
export function GetModuleReadme(id) {
    let $resultPromise = /** @type {any} */($Call.ByID(2350751181, id));
    return $resultPromise;
}

/**
 * @returns {Promise<$models.ModuleResponse[]> & { cancel(): void }}
 */
export function GetModules() {
    let $resultPromise = /** @type {any} */($Call.ByID(2958421364));
    let $typingPromise = /** @type {any} */($resultPromise.then(($result) => {
        return $$createType2($result);
    }));
    $typingPromise.cancel = $resultPromise.cancel.bind($resultPromise);
    return $typingPromise;
}

/**
 * @param {string} query
 * @returns {Promise<$models.ModuleResponse[]> & { cancel(): void }}
 */
export function SearchModules(query) {
    let $resultPromise = /** @type {any} */($Call.ByID(856364626, query));
    let $typingPromise = /** @type {any} */($resultPromise.then(($result) => {
        return $$createType2($result);
    }));
    $typingPromise.cancel = $resultPromise.cancel.bind($resultPromise);
    return $typingPromise;
}

// Private type creation functions
const $$createType0 = $models.ModuleResponse.createFrom;
const $$createType1 = $Create.Nullable($$createType0);
const $$createType2 = $Create.Array($$createType0);
