import { Context, createContext, PropsWithChildren, useCallback, useContext, useMemo } from "react";

export type ForContextValueTyped<T> = {
    value: T;
    onChange: (value: T) => void;
}
export type ForContextValue = {
    value: object;
    onChange: (value: object, name?: string) => void;
}

export const ForContext = createContext<ForContextValue | null>(null);

export type ForProviderProps<TValue> = {
    value: ForContextValueTyped<TValue>
}

export function ForProvider<TValue>(props: PropsWithChildren<ForProviderProps<TValue>>) {
    const { children, value } = props;
    return (
        <ForContext.Provider
            value={value as unknown as ForContextValue}
        >{children}</ForContext.Provider>
    );
}

export function useFor<TValue>() {

    const context = useContext<ForContextValueTyped<TValue>>(
        (ForContext as unknown) as Context<ForContextValueTyped<TValue>>
    );

    if (!context) {
        throw new Error('useFor must be used under For');
    }

    return context;
}


export function useForField<TFieldValue>(field: string) {

    const context = useContext<ForContextValue>(
        (ForContext as unknown) as Context<ForContextValue>
    );

    if (!context) {
        throw new Error('useForField must be used under For');
    }

    const value: { [name: string]: any } = context.value;
    const onChange = context.onChange;

    const handleChange = useCallback((fieldValue: TFieldValue) => {

        onChange(
            {
                ...value,
                [field]: fieldValue
            },
            field
        );
    }, [value, onChange, field]);

    return useMemo<{
        value: TFieldValue,
        handleChange: (fieldValue: TFieldValue, field?: string) => void
    }>(() => ({
        value: value[field] as TFieldValue,
        handleChange,
    }), [value, handleChange]);

}