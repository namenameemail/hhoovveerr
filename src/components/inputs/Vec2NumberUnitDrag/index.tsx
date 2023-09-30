import React, { ReactNode, useCallback } from "react";

import {
    DragEvent,
    DragHandler,
} from "bbuutoonnss";
import { NumberUnit, SizeUnit, Vec, Vec2NumberUnit } from "../../../LevelEditor/store/currentProject/tree/types";

export enum Direction {
    x = 'x',
    y = 'y',
    nx = 'nx',
    ny = 'ny',

}

export interface Vec2NumberUnitDragProps {
    value: Vec2NumberUnit;
    onChange: (value: Vec2NumberUnit, name?: string, isIntermediate?: boolean) => void;
    name: string;
    className?: string;
    angle?: number;
    direction?: Direction;
    min?: number;
    children?: ReactNode;

    getRootSize: () => Vec; // for vh, vw
    getParentSize: () => Vec; // for %

    pointerLock?: boolean
}

export const getDist = {
    [Direction.x]: (x: number, y: number) => +(x || 0),
    [Direction.y]: (x: number, y: number) => +(y || 0),
    [Direction.nx]: (x: number, y: number) => -(x || 0),
    [Direction.ny]: (x: number, y: number) => -(y || 0),
};

export const getValueChangeByUnit: { [key: string]: (value: number, parentSize: number, viewSize: Vec) => number } = {
    ['px']: (size: number, parentSizeX: number, viewSize: Vec) => (size),
    ['%']: (size: number, parentSizeX: number, viewSize: Vec) => size / parentSizeX * 100,

    ['vw']: (size: number, parentSizeX: number, viewSize: Vec) => (size / viewSize[0] * 100),
    ['vh']: (size: number, parentSizeX: number, viewSize: Vec) => (size / viewSize[1] * 100),
};

export function Vec2NumberUnitDrag(props: Vec2NumberUnitDragProps) {

    const {
        value, onChange,
        name,
        className,
        angle,
        direction = Direction.x,
        min,
        children,
        getParentSize,
        getRootSize,
        pointerLock,
    } = props;


    const vecValue: Vec = [value?.[0]?.[0] || 0, value?.[1]?.[0] || 0];

    const handleDrag = useCallback(({ x, y, isDragEnd }: DragEvent, e: MouseEvent, savedValue: Vec = [0, 0]) => {
        const parentSize: Vec = getParentSize();
        const rootSize: Vec = getRootSize();

        const xUnit = value?.[0]?.[1];
        const yUnit = value?.[1]?.[1];

        const nextValue: Vec2NumberUnit = [
            [savedValue[0] + getValueChangeByUnit[xUnit || SizeUnit.px](getDist[direction](x, y), parentSize[0], rootSize), xUnit],
            [savedValue[1] + getValueChangeByUnit[yUnit || SizeUnit.px](getDist[direction](y, x), parentSize[1], rootSize), yUnit]
        ];

        onChange(
            min === undefined ? nextValue : [
                [Math.max(min, nextValue[0][0]), xUnit],
                [Math.max(min, nextValue[1][0]), yUnit]
            ],
            name,
            !isDragEnd
        );
    }, [onChange, name, min, direction, value, getParentSize, getRootSize]);


    return (
        <DragHandler<Vec>
            angle={angle}
            saveValue={vecValue}
            onChange={handleDrag}
            className={className}
            pointerLock={pointerLock}
        >
            {children}
        </DragHandler>
    );
}