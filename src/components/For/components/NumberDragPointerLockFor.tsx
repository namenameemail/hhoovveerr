import { useForField } from "../context";
import { ReactNode, useCallback } from "react";
import { getDist, NumberDragForDirection } from "./NumberDragFor";

import {
    DragEvent,
    DivDragPointerLockHandler,
} from "bbuutoonnss";

export interface NumberDragPointerLockForProps {
    name: string;
    text?: string;
    className?: string;
    angle?: number;
    direction?: NumberDragForDirection;
    min?: number;
    children?: ReactNode
}

export function NumberDragPointerLockFor(props: NumberDragPointerLockForProps) {

    const { name, text, angle, min, className, direction = NumberDragForDirection.ny, children } = props;
    const { value, handleChange } = useForField<number>(name);

    const handleDragChange = useCallback(({ x, y, isDragEnd }: DragEvent, e: MouseEvent, savedValue: number = 0) => {
        console.log(x, y)
        handleChange(
            min !== undefined
                ? Math.max(min,
                    savedValue + (getDist[direction](x, y))
                )
                : savedValue + (getDist[direction](x, y)),
            !isDragEnd
        );
    }, [handleChange, min, direction]);
    return (
        <DivDragPointerLockHandler<number>
            angle={angle}
            saveValue={value}
            onChange={handleDragChange}
            className={className}
        >{children || <>{text || name} {value}</>}</DivDragPointerLockHandler>
    );
}