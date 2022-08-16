import { useForField } from "../context";
import { useCallback } from "react";

import {
    SelectDrop,
    SelectDropProps,
    SelectButtonsEventData,
} from "bbuutoonnss";

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