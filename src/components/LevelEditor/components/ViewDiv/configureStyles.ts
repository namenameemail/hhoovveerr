import { CSSProperties } from "react";
import { DivParameters } from "../../store/divTree/types";
import { AssetImage } from "../../store/assets/types";

export interface DivStyles {
    main: CSSProperties,
    text: CSSProperties,
}

export const getStyles = (state: DivParameters, isBlendActive: boolean, images: AssetImage[]): DivStyles => {

    const {
        color,
        size = [0, 0],
        borderWidth = 0,
        startPoint = [0, 0],
        shadowXYOffset = [0, 0],
        textShadowXYOffset = [0, 0],
        textPosition = [0, 0],
        sizeXUnit,
        sizeYUnit,
        startXUnit,
        startYUnit,
        backgroundImageName,
    } = state;
    const imageBG = backgroundImageName ? images.find(({id}) => id === +backgroundImageName)?.objectUrl || '' : ''

    const main = {
        background: color,
        width: `calc(${size[0]}${sizeXUnit} + ${2 * borderWidth}px)`,
        height: `calc(${size[1]}${sizeYUnit} + ${2 * borderWidth}px)`,
        left: `calc(${startPoint[0]}${startXUnit} - ${borderWidth}px)`,
        top: `calc(${startPoint[1]}${startYUnit} - ${borderWidth}px)`,
        zIndex: state.zIndex,

        transform: `rotate(${state.angle}deg)`,
        borderWidth: state.borderWidth,
        borderRadius: state.borderRadius,
        borderColor: state.borderColor,
        borderStyle: state.borderStyle,
        boxShadow: `${state.shadowInset ? 'inset ' : ''}${shadowXYOffset[0]}px ${shadowXYOffset[1]}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}`,
        mixBlendMode: isBlendActive ? state.blendMode : 'normal',
        backgroundImage: imageBG ? `url(${imageBG})` : undefined,
    } as CSSProperties;

    const text = {
        fontSize: state.fontSize,
        fontFamily: state.font,
        fontStyle: state.fontStyle,
        fontWeight: state.fontWeight,
        color: state.textColour,
        position: 'absolute',
        left: textPosition[0],
        top: textPosition[1],
        textShadow: `${textShadowXYOffset[0]}px ${textShadowXYOffset[1]}px ${state.textShadowBlur}px ${state.textShadowColor}`
    } as CSSProperties;

    return { main, text };
};