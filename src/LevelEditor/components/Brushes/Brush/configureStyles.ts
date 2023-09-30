import { CSSProperties } from "react";
import { Asset } from "../../../store/currentProject/assets/types";
import { BrushStyleParameters } from "../../../store/currentProject/brushes/types";
import { SizeUnit } from "../../../store/currentProject/tree/types";
import { getNumberUnitCssValue, getVec2NumberUnitCssValue } from "../../../utils/css";

export interface BrushStyles {
    main: CSSProperties,
}

export const getStyles = (state: BrushStyleParameters, images: Asset[]): BrushStyles => {

    const {
        color,
        shadowXYOffset = [[0, SizeUnit.px], [0, SizeUnit.px]],
        backgroundImageId,
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,
    } = state;
    const imageBG = backgroundImageId ? images.find(({ id }) => id === backgroundImageId)?.objectUrl || '' : '';


    const main = {
        width: 30,
        height: 20,
        backgroundColor: color || 'white',

        // border: '1px solid red',
        boxSizing: 'border-box',
        borderWidth: Math.min(8, state.borderWidth?.[0] || 0) + (state.borderWidth?.[1] || ''),
        borderRadius: state.borderRadius || 0,
        borderColor: state.borderColor || 'black',
        borderStyle: state.borderStyle || 'solid',
        boxShadow: `${state.shadowInset ? 'inset ' : ''}${getVec2NumberUnitCssValue(shadowXYOffset, SizeUnit.px)} ${getNumberUnitCssValue(state.shadowBlur)} ${getNumberUnitCssValue(state.shadowSpread)} ${state.shadowColor}`,
        backgroundImage: imageBG ? `url(${imageBG})` : undefined,
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,
    } as CSSProperties;

    return { main };
};