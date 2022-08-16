import { DivParameters } from "../../store/divTree/types";
import { CSSProperties, useMemo } from "react";


export const useDivStyle = (parameters: DivParameters, override: (parameters: CSSProperties) => CSSProperties = a => a, deps?: any[]): CSSProperties => {

    return useMemo(() => {
        const {
            color, size, startPoint, angle,
            relativeSizeX,
            relativeSizeY,
            relativeStartX,
            relativeStartY,
        } = parameters;

        return override({
            width: size[0] + (relativeSizeX ? '%' : 'px'),
            height: size[1] + (relativeSizeY ? '%' : 'px'),
            left: startPoint[0] + (relativeStartX ? '%' : 'px'),
            top: startPoint[1] + (relativeStartY ? '%' : 'px'),
            background: color,

            transform: `rotate(${angle}deg)`

        });
    }, [parameters, override, ...(deps || [])]);
};