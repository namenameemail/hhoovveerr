import { RefObject } from "react";
import { DivId, Vec } from "../../store/currentProject/tree/types";

export class DivRefService {

    constructor() {
    }

    refs: {
        [elementId: string]: {
            ref: RefObject<HTMLDivElement>,
            parentAngle: number
        } | undefined
    } = {};

    registerRef = (elementId: string, ref: RefObject<HTMLDivElement>, parentAngle: number) => {
        this.refs[elementId] = { ref, parentAngle }
    }
    unregisterRef = (elementId: string) => {
        this.refs[elementId] = undefined
    }

    getDivSizeById = (elementId: DivId) => (): Vec => {
        return [this.refs[elementId]?.ref.current?.offsetWidth || 0, this.refs[elementId]?.ref.current?.offsetHeight || 0];
    };
}

