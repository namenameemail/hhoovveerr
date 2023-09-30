import { useForField } from "../context";
import { useCallback } from "react";

import {
    BlurEnterTextInput,
    BlurEnterTextInputProps,
} from "bbuutoonnss";

export type TextInputForProps = {
    name: string
} & Omit<BlurEnterTextInputProps, 'onChange' | 'value' | 'changeOnEnter' | 'resetOnBlur'>

export function TextInputFor<TValue = {}>(props: TextInputForProps) {

    const { name } = props;
    const { value, handleChange } = useForField<string>(name);

    const handleInputChange = useCallback((value: string) => {
        handleChange(value)
    }, [handleChange])
    return (
        <BlurEnterTextInput
            {...props}
            changeOnChange
            value={value}
            onChange={handleInputChange}
        />
    );
}
