import { RefCallback, MutableRefObject, useCallback, useEffect, useRef } from "react";
import { DivRefService } from "../index";

export const useDivRefRegistration = (refService: DivRefService, id: string, parentAngle: number): [
    divRef: MutableRefObject<HTMLDivElement | null>,
    setDivRef: RefCallback<HTMLDivElement>
] => {
    const divRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);

    const setDivRef: RefCallback<HTMLDivElement> = useCallback((node) => {
        divRef.current = node;
        refService.registerRef(id, divRef, parentAngle);
    }, [divRef, id, parentAngle, refService]);

    useEffect(() => {
        refService.registerRef(id, divRef, parentAngle);
        return () => {
            refService.unregisterRef(id);
        };
    }, [divRef, id, parentAngle, refService]);

    return [
        divRef,
        setDivRef
    ]
}