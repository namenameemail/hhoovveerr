
import { ChangeEvent, useCallback } from "react";


export type SelectArrayProps = {
    name: string
    title: string
    options: string[]
    value?: string
    onChange?: (value: string, name: string) => void
}

export function SelectArray(props: SelectArrayProps) {

    const { name, title, options, value, onChange } = props;

    const handleSelectChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e.target.value, name);
    }, [onChange, name]);

    return (
        <select
            value={value}
            onChange={handleSelectChange}
            title={title}
        >
            {options.map(option => {
                return <option key={option} value={option}>{option}</option>
            })}
        </select>
    );
}