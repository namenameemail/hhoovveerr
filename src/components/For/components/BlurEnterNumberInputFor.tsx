import { useForField } from "../context";

import {
    BlurEnterNumberInput,
    BlurEnterInputProps,
} from "bbuutoonnss";

export type BlurEnterNumberInputForProps = {
    name: string
} & Omit<BlurEnterInputProps, 'onChange' | 'value' | 'changeOnEnter' | 'resetOnBlur'>

export function BlurEnterNumberInputFor<TValue = {}>(props: BlurEnterNumberInputForProps) {

    const { name } = props;
    const { value, handleChange } = useForField<number | undefined>(name);

    return (
        <BlurEnterNumberInput
            {...props}
            changeOnEnter
            resetOnBlur
            value={value}
            onChange={handleChange}
        />
    );
}