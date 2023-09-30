import { CSSProperties } from "react";
import { DivStyleParameters, SizeUnit, Vec } from "../../store/currentProject/tree/types";
import { Asset } from "../../store/currentProject/assets/types";
import { getSize } from "../EditDiv/helpers/configureStyles";
import { getNumberUnitCssValue, getVec2NumberUnitCssValue } from "../../utils/css";

export interface DivTreeNodeStyles {
    main: CSSProperties,
}

export const getStyles = (state: DivStyleParameters, images: Asset[]): DivTreeNodeStyles => {

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
        backgroundColor: color,

        width: '100%',
        boxSizing: 'border-box',
        borderWidth: Math.min(8,state.borderWidth?.[0] || 0) + (state.borderWidth?.[1] || ''),
        borderRadius: state.borderRadius,
        borderColor: state.borderColor,
        borderStyle: state.borderStyle,
        boxShadow: `${state.shadowInset ? 'inset ' : ''}${getVec2NumberUnitCssValue(shadowXYOffset, SizeUnit.px)} ${getNumberUnitCssValue(state.shadowBlur)} ${getNumberUnitCssValue(state.shadowSpread)} ${state.shadowColor}`,
        backgroundImage: imageBG ? `url(${imageBG})` : undefined,
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,
    } as CSSProperties;

    return { main };
};