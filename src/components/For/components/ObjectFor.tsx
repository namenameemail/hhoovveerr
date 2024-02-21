import { ReactNode, useMemo } from "react";
import { ForProvider, useForField } from "../context";
import cn from "classnames";

export interface ObjectForProps {
    name: string
    className?: string
    children: ReactNode
}

export function ObjectFor<TValue extends {}>(props: ObjectForProps) {

    const { name, className, children } = props;
    const { value, handleChange } = useForField<TValue>(name);

    const ForContextValue = useMemo(() => ({
        value,
        onChange: (value: TValue, isIntermediate?: boolean) => {
            handleChange(value, isIntermediate);
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
