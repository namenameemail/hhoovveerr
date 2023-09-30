import React, { ReactNode, useCallback } from "react";

import {
    BlurEnterTextInput,
} from "bbuutoonnss";
import { NumberUnit, SizeUnit, Vec, Vec2NumberUnit } from "../../../LevelEditor/store/currentProject/tree/types";
import { forField } from "../../For/hoc/forField";
import { Vec2NumberUnitDrag, Vec2NumberUnitDragProps } from "../Vec2NumberUnitDrag";

export enum Direction {
    x = 'x',
    y = 'y',
    nx = 'nx',
    ny = 'ny',
}

export interface Vec2NumberUnitInputDragProps extends Vec2NumberUnitDragProps {
    text?: string;
    title?: string;
    placeholder?: string;
    children?: ReactNode;

    units: string[];
    autoResetUnitTo?: string;
    separator?: string;
}

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

export function Vec2NumberUnitInputDrag(props: Vec2NumberUnitInputDragProps) {

    const {
        value, onChange,
        name,
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
        <Vec2NumberUnitDrag
            value={value}
            onChange={onChange}
            name={name}
            className={className}
            angle={angle}
            direction={direction}
            min={min}
            getParentSize={getParentSize}
            getRootSize={getRootSize}
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
        </Vec2NumberUnitDrag>
    );
}

export const Vec2NumberUnitInputDragFor = forField<Vec2NumberUnit, Omit<Vec2NumberUnitInputDragProps, 'value' | 'onChange'>>(Vec2NumberUnitInputDrag);