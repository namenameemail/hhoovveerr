import React, { ReactNode, useCallback } from "react";

import {
    DragEvent,
    BlurEnterTextInput,
    DragHandler,
} from "bbuutoonnss";
import { NumberUnit, SizeUnit, Vec, Vec2NumberUnit } from "../../../LevelEditor/store/currentProject/tree/types";
import { forField } from "../../For/hoc/forField";


export enum Direction {
    x = 'x',
    y = 'y',
    nx = 'nx',
    ny = 'ny',

}

export interface BgSizeDragInputProps {
    value: Vec2NumberUnit;
    onChange: (value: Vec2NumberUnit, name?: string, isIntermediate?: boolean) => void;
    name: string;
    text?: string;
    title?: string;
    placeholder?: string;
    className?: string;
    angle?: number;
    direction?: Direction;
    min?: number;
    children?: ReactNode;

    units: string[];
    autoResetUnitTo?: string;
    separator?: string;

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


export const parseTextToVec2NumberUnit = (string: string, units: string[], autoResetUnitTo: string = '', separator: string): Vec2NumberUnit => {

    const texts = string.split(separator);
    return [texts[0], texts[1]].map((text, i) => {
        const unit = units.find((unit) => {
            return text.indexOf(unit) !== -1;
        });
        console.log(i, text, unit, parseFloat(text));
        return [
            parseFloat(text),
            unit || autoResetUnitTo
        ] as NumberUnit;
    }) as [NumberUnit, NumberUnit];

};

const getValueChange: { [key: string]: (value: number, parentSize: number, viewSize: Vec) => number } = {
    ['px']: (size: number, parentSizeX: number, viewSize: Vec) => (size),
    ['%']: (size: number, parentSizeX: number, viewSize: Vec) => size / parentSizeX * 100,

    ['vw']: (size: number, parentSizeX: number, viewSize: Vec) => (size / viewSize[0] * 100),
    ['vh']: (size: number, parentSizeX: number, viewSize: Vec) => (size / viewSize[1] * 100),
};

const getUnitChange: { [key: string]: (size: number, parentSize: number, viewSize: Vec) => number } = {
    ['%-px']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * parentSize),
    ['px-%']: (size: number, parentSize: number, viewSize: Vec) => (size / parentSize * 100),

    ['px-vw']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[0] * 100),
    ['vw-px']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[0]),
    ['px-vh']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[1] * 100),
    ['vh-px']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[1]),

    ['%-vw']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * parentSize / viewSize[0] * 100),
    ['vw-%']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[0] / parentSize * 100),
    ['%-vh']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * parentSize / viewSize[1] * 100),
    ['vh-%']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[1] / parentSize * 100),


    ['vw-vh']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[0] / viewSize[1] * 100),
    ['vh-vw']: (size: number, parentSize: number, viewSize: Vec) => (size / 100 * viewSize[1] / viewSize[0] * 100),
};

export function BgSizeDragInput(props: BgSizeDragInputProps) {

    const {
        value, onChange,
        name,
        text,
        className,
        angle,
        direction = Direction.x,
        min,
        children,
        title = props.text,
        placeholder = props.text,
        units,
        autoResetUnitTo,
        getParentSize,
        getRootSize,
        separator = ', ',
        pointerLock,
    } = props;


    const vecValue: Vec = [value?.[0]?.[0] || 0, value?.[1]?.[0] || 0];

    const handleDrag = useCallback(({ x, y, isDragEnd }: DragEvent, e: MouseEvent, savedValue: Vec = [0, 0]) => {
        const parentSize: Vec = getParentSize();
        const rootSize: Vec = getRootSize();

        const xUnit = value?.[0]?.[1];
        const yUnit = value?.[1]?.[1];

        const nextValue: Vec2NumberUnit = [
            [savedValue[0] + getValueChange[xUnit || SizeUnit.px](getDist[direction](x, y), parentSize[0], rootSize), xUnit],
            [savedValue[1] + getValueChange[yUnit || SizeUnit.px](getDist[direction](y, x), parentSize[1], rootSize), yUnit]
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

    const textValue = (value?.[0]?.[0] || 0).toFixed(2) + (value?.[0]?.[1] || '') + separator + (value?.[1]?.[0] || 0).toFixed(2) + (value?.[1]?.[1] || '');
    const textChangeHandler = useCallback((newValueText: string) => {
        const parentSize: Vec = getParentSize();
        const rootSize: Vec = getRootSize();
        const newValue = parseTextToVec2NumberUnit(newValueText, units, autoResetUnitTo, separator);

        if (value[0][0].toFixed(2) === newValue[0][0].toFixed(2) && (value[0][1] || SizeUnit.px) !== (newValue[0][1] || SizeUnit.px)) {
            const transformDirection = [value[0][1] || SizeUnit.px, newValue[0][1] || SizeUnit.px].join('-');
            newValue[0][0] = getUnitChange[transformDirection](value[0][0], parentSize[0], rootSize);
        }

        if (value[1][0].toFixed(2) === newValue[1][0].toFixed(2) && (value[1][1] || SizeUnit.px) !== (newValue[1][1] || SizeUnit.px)) {
            const transformDirection = [value[1][1] || SizeUnit.px, newValue[1][1] || SizeUnit.px].join('-');
            newValue[1][0] = getUnitChange[transformDirection](value[1][0], parentSize[1], rootSize);
        }

        onChange(
            newValue,
            name,
            false
        );
    }, [onChange, name, units, value, autoResetUnitTo, separator, getParentSize, getRootSize]);

    return (
        <DragHandler<Vec>
            angle={angle}
            saveValue={vecValue}
            onChange={handleDrag}
            className={className}
            pointerLock={pointerLock}
        >
            <BlurEnterTextInput
                value={textValue}
                changeOnEnter
                resetOnBlur
                onChange={textChangeHandler}
                name={name}
                title={title}
                placeholder={placeholder}
            />
            {children}
        </DragHandler>
    );
}

export const BgSizeDragInputFor = forField<Vec2NumberUnit, Omit<BgSizeDragInputProps, 'value' | 'onChange'>>(BgSizeDragInput);