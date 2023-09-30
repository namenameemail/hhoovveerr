import { useForField } from "../context";
import React, { ReactNode, useCallback } from "react";

import {
    DragEvent,
    BlurEnterTextInput,
    DragHandler,
} from "bbuutoonnss";
import { NumberDragForDirection } from "./NumberDragFor";
import { NumberUnit, SizeUnit } from "../../../LevelEditor/store/currentProject/tree/types";

export interface NumberUnitDragPLInputForProps {
    name: string;
    text?: string;
    title?: string;
    placeholder?: string;
    className?: string;
    angle?: number;
    direction?: NumberDragForDirection;
    min?: number;
    children?: ReactNode;

    units: string[]
    autoResetUnitTo?: string
}

export const getDist = {
    [NumberDragForDirection.x]: (x: number, y: number) => x,
    [NumberDragForDirection.y]: (x: number, y: number) => y,
    [NumberDragForDirection.nx]: (x: number, y: number) => -x,
    [NumberDragForDirection.ny]: (x: number, y: number) => -y,
};


export const parseTextToNumberUnit = (text: string, units: string[], autoResetUnitTo: string = ''): NumberUnit => {

    const unit = units.find((unit) => {
        return text.indexOf(unit) !== -1
    })
    return [
        parseFloat(text),
        (unit || autoResetUnitTo) as SizeUnit
    ]
};

export function NumberUnitDragPLInputFor(props: NumberUnitDragPLInputForProps) {

    const {
        name,
        text,
        className,
        angle,
        direction = NumberDragForDirection.ny,
        min,
        children,
        title = props.text,
        placeholder = props.text,
        units,
        autoResetUnitTo,
    } = props;


    const { value, handleChange } = useForField<NumberUnit>(name);

    const handleDragChange = useCallback(({ x, y, isDragEnd }: DragEvent, e: MouseEvent, savedValue: number = 0) => {
        const newValue0 = min !== undefined
            ? Math.max(min, savedValue + (getDist[direction](x, y)))
            : savedValue + (getDist[direction](x, y));

        handleChange(
            [newValue0, value?.[1]],
            !isDragEnd
        );
    }, [handleChange, min, direction, value]);


    const numberValue = value?.[0] || 0;

    const textValue = (value?.[0] || 0).toFixed(2) + (value?.[1] || '');
    const textChangeHandler = useCallback((value: string) => {

        handleChange(parseTextToNumberUnit(value, units, autoResetUnitTo));
    }, [handleChange, value, units, autoResetUnitTo]);

    return (
        <DragHandler<number>
            angle={angle}
            saveValue={numberValue}
            onChange={handleDragChange}
            className={className}
            pointerLock
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
        </DragHandler>
    );
}