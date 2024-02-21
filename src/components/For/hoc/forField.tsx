import { useForField } from "../context";
import React, { useCallback, ComponentProps } from "react";

export interface ForFieldProps {
    name: string;
}

export type FieldProps<TValue = any, TRestProps extends ForFieldProps = ForFieldProps> = TRestProps & {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function forField<TValue = any, TRestProps extends ForFieldProps = ForFieldProps>(Component: React.ComponentType<FieldProps<TValue, TRestProps>>) {
    return (props: TRestProps) => {
        const { name } = props;
        const { value, handleChange } = useForField<TValue>(name);

        const handleInputChange = useCallback((value: TValue) => {
            handleChange(value);
        }, [handleChange]);
        return (
            <Component
                {...props}
                value={value}
                onChange={handleInputChange}
            />
        );
    };
}

