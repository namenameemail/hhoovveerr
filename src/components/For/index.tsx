import cn from 'classnames';
import { ReactNode, useMemo } from "react";
import {
    ForProvider,
} from "./context";

export type ForProps<TValue> = {
    className?: string;
    value: TValue;
    onChange: (value: TValue, name?: string, isIntermediate?: boolean) => void;
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
        onChange: (value: TValue, isIntermediate?: boolean) => {
            onChangeProps(value, name, isIntermediate);
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

export { ObjectFor } from './components/ObjectFor';
export type { ObjectForProps } from './components/ObjectFor';
export { BlurEnterTextInputFor } from './components/BlurEnterTextInputFor';
export type { BlurEnterTextInputForProps } from './components/BlurEnterTextInputFor';
export { BlurEnterNumberInputFor } from './components/BlurEnterNumberInputFor';
export type { BlurEnterNumberInputForProps } from './components/BlurEnterNumberInputFor';
export { CheckboxFor } from './components/CheckboxFor';
export type { CheckboxForProps } from './components/CheckboxFor';
export { NumberDragFor } from './components/NumberDragFor';
export type { NumberDragForProps } from './components/NumberDragFor';
export { NumberDragPointerLockFor } from './components/NumberDragPointerLockFor';
export type { NumberDragPointerLockForProps } from './components/NumberDragPointerLockFor';
export { SelectDropFor } from './components/SelectDropFor';
export type { SelectDropForProps } from './components/SelectDropFor';
export { Vec2DragFor } from './components/Vec2DragFor';
export type { Vec2DragForProps } from './components/Vec2DragFor';
export { Vec2DragPointerLockFor } from './components/Vec2DragPointerLockFor';
export type { Vec2DragPointerLockForProps } from './components/Vec2DragPointerLockFor';
