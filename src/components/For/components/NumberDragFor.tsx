import { useForField } from "../context";
import { useCallback } from "react";

import {
    DragHandler,
    DragEvent,
} from "bbuutoonnss";

export enum NumberDragForDirection {
    x = 'x',
    y = 'y',
    nx = 'nx',
    ny = 'ny',

}

export interface NumberDragForProps {
    name: string;
    text?: string;
    className?: string;
    angle?: number;
    direction?: NumberDragForDirection;
    min?: number;
}

export const getDist = {
    [NumberDragForDirection.x]: (x: number, y: number) => x,
    [NumberDragForDirection.y]: (x: number, y: number) => y,
    [NumberDragForDirection.nx]: (x: number, y: number) => -x,
    [NumberDragForDirection.ny]: (x: number, y: number) => -y,
};

export function NumberDragFor(props: NumberDragForProps) {

    const { name, text, angle, min, className, direction = NumberDragForDirection.ny } = props;
    const { value, handleChange } = useForField<number>(name);

    const handleDragChange = useCallback(({ x, y, isDragEnd }: DragEvent, e: MouseEvent, savedValue: number = 0) => {
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
        <DragHandler<number>
            angle={angle}
            saveValue={value}
            onChange={handleDragChange}
            className={className}
            pointerLock={false}
        >{text || name} {value}</DragHandler>
    );
}