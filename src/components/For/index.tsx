import cn from 'classnames';
import { ReactNode, createContext, useMemo, PropsWithChildren, useCallback } from "react";
import {
    ForContextValue, ForContextValueTyped,
    ForProvider,
    useFor,
    useForField
} from "./context";
import {
    SelectDrop,
    SelectDropProps,
    SelectButtonsEventData,
    BlurEnterNumberInput,
    BlurEnterInputProps,
    BlurEnterTextInput,
    BlurEnterTextInputProps,
    DivDragHandler,
    DragEvent,
    DivDragWithPointerLock,
    DivDragPointerLockHandler,
    DivDragPointerLockHandlerProps,
} from "bbuutoonnss";
import { Vec } from "../LevelEditor/store/divTree/types";

export type ForProps<TValue> = {
    className?: string;
    value: TValue;
    onChange: (value: TValue, name?: string) => void;
    children: ReactNode;
    name?: string
}

export function For<TValue>(props: ForProps<TValue>) {

    const {
        className,
        children,
        value,
        onChange: onChangeProps,
        name,
    } = props;

    const forContextValue = useMemo(() => ({
        value,
        onChange: (value: TValue) => {
            onChangeProps(value, name);
        }
    }), [value, onChangeProps, name]);

    return (
        <ForProvider<TValue> value={forContextValue}>
            <div className={cn(className)}>
                {children}
            </div>
        </ForProvider>
    );
}


export type ReduxObjectForProps = {
    name: string
    className?: string
    children: ReactNode
}

export function ObjectFor<TValue extends {}>(props: ReduxObjectForProps) {

    const { name, className, children } = props;
    const { value, handleChange } = useForField<TValue>(name);

    const ForContextValue = useMemo(() => ({
        value,
        onChange: (value: TValue) => {
            handleChange(value);
        }
    }), [value, name]);

    return (
        <ForProvider<TValue> value={ForContextValue}>
            <div className={cn(className)}>
                {children}
            </div>
        </ForProvider>
    );
}

export type BlurEnterTextInputForProps = {
    name: string
} & Omit<BlurEnterTextInputProps, 'onChange' | 'value' | 'changeOnEnter' | 'resetOnBlur'>

export function BlurEnterTextInputFor<TValue = {}>(props: BlurEnterTextInputForProps) {

    const { name } = props;
    const { value, handleChange } = useForField<string>(name);

    return (
        <BlurEnterTextInput
            {...props}
            changeOnEnter
            resetOnBlur
            value={value}
            onChange={handleChange}
        />
    );
}


export type BlurEnterNumberInputForProps = {
    name: string
} & Omit<BlurEnterInputProps, 'onChange' | 'value' | 'changeOnEnter' | 'resetOnBlur'>

export function BlurEnterNumberInputFor<TValue = {}>(props: BlurEnterNumberInputForProps) {

    const { name } = props;
    const { value, handleChange } = useForField<number | undefined>(name);

    return (
        <BlurEnterNumberInput
            {...props}
            changeOnEnter
            resetOnBlur
            value={value}
            onChange={handleChange}
        />
    );
}


export type SelectDropForProps = {
    name: string
} & Omit<SelectDropProps, 'onChange' | 'value'>

export function SelectDropFor<TValue = any>(props: SelectDropForProps) {

    const { name } = props;
    const { value, handleChange } = useForField<TValue>(name);

    const handleSelectChange = useCallback(({ item }: SelectButtonsEventData) => {
        handleChange(item);
    }, [handleChange]);
    return (
        <SelectDrop
            {...props}
            value={value}
            onChange={handleSelectChange}
        />
    );
}

export interface CheckboxForProps {
    name: string;
    text?: string;
    className?: string;
}

export function CheckboxFor(props: CheckboxForProps) {

    const { name, text, className } = props;
    const { value, handleChange } = useForField<boolean>(name);

    const handleInputChange = useCallback(() => {
        handleChange(!value);
    }, [handleChange, value]);

    return (
        <div>
            <label className={className}>
                <input
                    type="checkbox"
                    checked={value}
                    onChange={handleInputChange}
                />
                {text || name}
            </label>
        </div>
    );
}

export interface Vec2DragForProps {
    name: string;
    text?: string;
    className?: string;
    angle?: number;
}

export function Vec2DragFor(props: Vec2DragForProps) {

    const { name, text, angle, className } = props;
    const { value, handleChange } = useForField<Vec>(name);

    const handleDragChange = useCallback(({ x, y }: DragEvent, e: MouseEvent, savedValue?: Vec) => {
        savedValue && handleChange([savedValue[0] + x, savedValue[1] + y]);
    }, [handleChange]);
    return (
        <DivDragHandler<Vec>
            angle={angle}
            saveValue={value}
            onDrag={handleDragChange}
            className={className}
        >{text || name} {value[0]},{value[1]}</DivDragHandler>
    );
}

export interface Vec2DragPointerLockForProps {
    name: string;
    text?: string;
    className?: string;
    angle?: number;
}

export function Vec2DragPointerLockFor(props: Vec2DragPointerLockForProps) {

    const { name, text, angle, className } = props;
    const { value, handleChange } = useForField<Vec>(name);

    const handleDrag = useCallback(({ x, y }: DragEvent, e: MouseEvent, savedValue?: Vec) => {
        if (savedValue) {
            handleChange([savedValue[0] + x, savedValue[1] + y]);
        }
    }, [handleChange]);
    return (
        <DivDragPointerLockHandler<[number, number]>
            saveValue={value}
            angle={angle || 0}
            onDrag={handleDrag}
        >{text || name} {value[0].toFixed(0)},{value[1].toFixed(0)}</DivDragPointerLockHandler>
    );
}

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

const getDist = {
    [NumberDragForDirection.x]: (x: number, y: number) => x,
    [NumberDragForDirection.y]: (x: number, y: number) => y,
    [NumberDragForDirection.nx]: (x: number, y: number) => -x,
    [NumberDragForDirection.ny]: (x: number, y: number) => -y,
};

export function NumberDragFor(props: NumberDragForProps) {

    const { name, text, angle, min, className, direction = NumberDragForDirection.ny } = props;
    const { value, handleChange } = useForField<number>(name);

    const handleDragChange = useCallback(({ x, y }: DragEvent, e: MouseEvent, savedValue: number = 0) => {
        handleChange(
            min !== undefined
                ? Math.max(min,
                    savedValue + (getDist[direction](x, y))
                )
                : savedValue + (getDist[direction](x, y))
        );
    }, [handleChange, min, direction]);
    return (
        <DivDragHandler<number>
            angle={angle}
            saveValue={value}
            onDrag={handleDragChange}
            className={className}
        >{text || name} {value}</DivDragHandler>
    );
}
