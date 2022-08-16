import { useForField } from "../context";
import { Vec } from "../../LevelEditor/store/divTree/types";
import React, { ReactNode, useCallback } from "react";

import {
    DragEvent,
    DivDragPointerLockHandler,
} from "bbuutoonnss";

export interface Vec2DragPointerLockForProps {
    name: string;
    text?: string;
    className?: string;
    angle?: number;
    children?: ReactNode;
}

export function Vec2DragPointerLockFor(props: Vec2DragPointerLockForProps) {

    const { name, text, angle, className, children } = props;
    const { value, handleChange } = useForField<Vec>(name);

    const handleDrag = useCallback(({ x, y, isDragEnd }: DragEvent, e: MouseEvent, savedValue: Vec = [0, 0]) => {
        handleChange([savedValue[0] + x, savedValue[1] + y], !isDragEnd);
    }, [handleChange]);

    return (
        <DivDragPointerLockHandler<[number, number]>
            saveValue={value}
            angle={angle || 0}
            onChange={handleDrag}
        >{children || (<>{text || name} {angle} {value?.[0].toFixed(0)},{value?.[1].toFixed(0)}</>)}</DivDragPointerLockHandler>
    );
}