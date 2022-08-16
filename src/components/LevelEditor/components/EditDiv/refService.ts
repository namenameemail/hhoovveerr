import { RefObject } from "react";

export const refService = new (class {

    constructor() {
    }

    refs: {
        [path: string]: {
            ref: RefObject<HTMLDivElement>,
            parentAngle: number
        }
    } = {};

    registerRef = (path: string, ref: RefObject<HTMLDivElement>, parentAngle: number) => {
        this.refs[path] = { ref, parentAngle }
    }

})();