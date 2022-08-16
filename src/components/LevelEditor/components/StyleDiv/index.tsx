
import React, { CSSProperties, ReactNode, useMemo } from "react";
import { DivParameters } from "../../store/divTree/types";
import { useDivStyle } from "./useDivStyle";


export interface StyleDivProps {
    parameters: DivParameters;
    style?: CSSProperties
    children?: ReactNode
    isRoot?: boolean;
}

export function StyleDiv(props: StyleDivProps) {
    const {
        parameters,
        style,
        children,
    } = props;

    const divStyle = useDivStyle(parameters, (divStyleFromParameters) => ({
        ...divStyleFromParameters,
        ...style
    }), [style])

    return (
        <div
            style={divStyle}
        >
            {children}
        </div>
    );
}
