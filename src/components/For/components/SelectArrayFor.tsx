import { useForField } from "../context";
import { ChangeEvent, useCallback } from "react";
import { SelectArray } from "../../inputs/SelectArray";

export type SelectArrayForProps = {
    name: string
    title: string
    options: string[]
    onChange?: (value: string) => void
}

export function SelectArrayFor(props: SelectArrayForProps) {

    const { name, title, options } = props;
    const { value, handleChange } = useForField<string>(name);

    const handleSelectChange = useCallback((value: string) => {
        handleChange(value);
    }, [handleChange]);

    return (
        <SelectArray
            title={title}
            options={options}
            name={name}
            value={value}
            onChange={handleSelectChange}
        />
    );
}