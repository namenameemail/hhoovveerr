import { useForField } from "../context";
import { useCallback } from "react";

import {
    SelectDrop,
    SelectDropProps,
    SelectButtonsEventData,
    BlurEnterNumberInput,
    BlurEnterInputProps,
    BlurEnterTextInput,
    BlurEnterTextInputProps,
    DivDragHandler,
    DragEvent,
    DivDragWithPointerLock,
    DivDragPointerLockHandler,
    DivDragPointerLockHandlerProps,
    BlurEnterTextInputWithSuggestionsProps,
    BlurEnterTextInputWithSuggestions,
} from "bbuutoonnss";

export type BlurEnterTextInputForProps = {
    name: string
} & Omit<BlurEnterTextInputProps, 'onChange' | 'value' | 'changeOnEnter' | 'resetOnBlur'>

export function BlurEnterTextInputFor<TValue = {}>(props: BlurEnterTextInputForProps) {

    const { name } = props;
    const { value, handleChange } = useForField<string>(name);

    const handleInputChange = useCallback((value: string) => {
        handleChange(value)
    }, [handleChange])
    return (
        <BlurEnterTextInput
            {...props}
            changeOnEnter
            resetOnBlur
            value={value}
            onChange={handleInputChange}
        />
    );
}
