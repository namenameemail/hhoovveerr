import { useCallback } from "react";

export interface CheckboxProps {
    name: string;
    text?: string;
    className?: string;
    onChange: (value: boolean) => void;
    value?: boolean;
}

export function Checkbox(props: CheckboxProps) {

    const { name, text, className, value, onChange } = props;

    const handleInputChange = useCallback(() => {
        onChange(!value);
    }, [onChange, value]);

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
