import { useForField } from "../context";
import { useCallback } from "react";

import {
    BlurEnterTextInputWithSuggestionsProps,
    BlurEnterTextInputWithSuggestions,
} from "bbuutoonnss";

export type BlurEnterTextInputWithSuggestionsForProps = {
    name: string
} & Omit<BlurEnterTextInputWithSuggestionsProps, 'onChange' | 'value' | 'changeOnEnter' | 'resetOnBlur'>

export function BlurEnterTextInputWithSuggestionsFor<TValue = {}>(props: BlurEnterTextInputWithSuggestionsForProps) {

    const { name } = props;
    const { value, handleChange } = useForField<string>(name);

    const handleInputChange = useCallback((value: string) => {
        handleChange(value)
    }, [handleChange])
    return (
        <BlurEnterTextInputWithSuggestions
            {...props}
            changeOnEnter
            resetOnBlur
            value={value}
            onChange={handleInputChange}
        />
    );
}