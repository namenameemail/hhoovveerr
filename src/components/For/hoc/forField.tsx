import { useForField } from "../context";
import React, { useCallback, ComponentProps } from "react";

export interface ForFieldProps {
    name: string;
}

export interface FieldProps<TValue = any> {
    value: TValue;
    onChange: (value: TValue) => void;
}

export function forField<TValue = any>(Component: React.ComponentType<FieldProps>) {
    return (props: ForFieldProps & Omit<ComponentProps<typeof Component>, 'value' | 'onChange'>) => {
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

