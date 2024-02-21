import { useForField } from "../context";
import { useCallback } from "react";

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
        <div className={className}>
            <label>
                <input
                    type="checkbox"
                    checked={value}
                    onChange={handleInputChange}
                />
                <span>{text || name}</span>
            </label>
        </div>
    );
}