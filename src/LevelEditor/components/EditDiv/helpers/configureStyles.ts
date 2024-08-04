import { CSSProperties } from "react";
import {
    DivBehaviorParameters,
    DivPositionParameters,
    DivStyleParameters,
    SizeUnit,
    Vec
} from "../../../store/currentProject/tree/types";
import { Asset } from "../../../store/currentProject/assets/types";
import { getNumberUnitCssValue, getVec2NumberUnitCssValue } from "../../../utils/css";

export interface DivStyles {
    origin: CSSProperties,
    main: CSSProperties,
    text: CSSProperties,
    children: CSSProperties,
    borderMain: CSSProperties,
    borderOrigin: CSSProperties,
    borderLeaf: CSSProperties,
    borderInactive: CSSProperties,
    pointerOrigin: CSSProperties,
}

export const getSize = (value: number, unit: SizeUnit, rootSize: Vec, neg?: boolean) => {
    if (unit === SizeUnit.vw) {
        return value / 100 * rootSize[0] + SizeUnit.px;
    }
    if (unit === SizeUnit.vh) {
        return value / 100 * rootSize[1] + SizeUnit.px;
    }
    return (neg ? -1 : 1) * value + unit;
};

export type StylesConfig = {
    styleParameters: DivStyleParameters
    positionParameters: DivPositionParameters
    behaviorParameters: DivBehaviorParameters
    isBlendActive: boolean,
    images: Asset[],
    fonts: Asset[],
    rootSize: Vec,
    isRoot?: boolean
    isInventoryItem?: boolean
}

export const getStyles = (stylesConfig: StylesConfig): DivStyles => {
    const {
        positionParameters,
        behaviorParameters,
        styleParameters,
        isBlendActive,
        images,
        fonts,
        rootSize,
        isRoot,
        isInventoryItem,
    } = stylesConfig;

    const {
        size = [[0, SizeUnit.px], [0, SizeUnit.px]],
        startPoint = [[0, SizeUnit.px], [0, SizeUnit.px]],
        angle = 0,
    } = positionParameters;

    const {
        collectableParameters: {
            inventorySize = [[0, SizeUnit.px], [0, SizeUnit.px]],
        }
    } = behaviorParameters;

    const {
        color,
        borderWidth = [0, SizeUnit.px],
        shadowXYOffset = [[0, SizeUnit.px], [0, SizeUnit.px]],
        backgroundImageId,
        textShadowXYOffset = [[0, SizeUnit.px], [0, SizeUnit.px]],
        textPosition = [[0, SizeUnit.px], [0, SizeUnit.px]],
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,
        fontId,
    } = styleParameters;

    const imageBG = backgroundImageId ? images.find(({ id }) => id === backgroundImageId)?.objectUrl || '' : '';

    const fontFamily = fontId ? fonts.find(({ id }) => id === fontId)?.name || '' : '';

    const width = `calc(${getSize(size[0][0], size[0][1], rootSize)} + ${2 * borderWidth[0]}${borderWidth[1] || SizeUnit.px})`,
        height = `calc(${getSize(size[1][0], size[1][1], rootSize)} + ${2 * borderWidth[0]}${borderWidth[1] || SizeUnit.px})`,
        left = `calc(${getSize(startPoint[0][0], startPoint[0][1], rootSize)} - ${getNumberUnitCssValue(borderWidth)})`,
        top = `calc(${getSize(startPoint[1][0], startPoint[1][1], rootSize)} - ${getNumberUnitCssValue(borderWidth)})`;
    const inventoryWidth = `calc(${getSize(inventorySize[0][0], inventorySize[0][1], rootSize)})`,
        inventoryHeight = `calc(${getSize(inventorySize[1][0], inventorySize[1][1], rootSize)})`;

    // if (isInventoryItem) {
    //
    //     console.log(222222, inventoryWidth, inventorySize[0][0], inventorySize[0][1], rootSize)
    // }
    const origin = isInventoryItem ? {
        width: inventoryWidth,
        height: inventoryHeight,
        zIndex: styleParameters.zIndex,
        mixBlendMode: isBlendActive ? styleParameters.blendMode : 'normal',
        position: (isRoot || isInventoryItem) ? 'relative' : 'absolute',
        display: 'flex',
    } as CSSProperties : {
        width,
        height,
        left,
        top,
        zIndex: styleParameters.zIndex,
        mixBlendMode: isBlendActive ? styleParameters.blendMode : 'normal',
        position: (isRoot || isInventoryItem) ? 'relative' : 'absolute',
        display: 'flex',
    } as CSSProperties;

    const pointerOrigin = {
        width: '100vmax',
        height: '100vmax',
        right: '100%',
        bottom: '100%',
        zIndex: styleParameters.zIndex,
        mixBlendMode: isBlendActive ? styleParameters.blendMode : 'normal',
        position: 'absolute',
        outline: '1px dotted white',
        border: '2px dotted black',
        pointerEvents: 'none'
    } as CSSProperties;

    const borderMain = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        outline: 2 + 'px dotted black',
        border: 1 + 'px dotted white',
        boxSizing: 'border-box',
        pointerEvents: 'none',
    } as CSSProperties;
    const borderLeaf = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        outline: 2 + 'px dotted black',
        border: 1 + 'px dotted white',
        boxSizing: 'border-box',
        pointerEvents: 'none',
    } as CSSProperties;
    const borderOrigin = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        outline: 1 + 'px solid rgba(0,0,0,0.2)',
        border: 1 + 'px solid rgba(255,255,255,0.2)',
        boxSizing: 'border-box',
        pointerEvents: 'none',
    } as CSSProperties;
    const borderInactive = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        outline: 1 + 'px solid rgba(0,0,0,0.3)',
        border: 1 + 'px solid rgba(255,255,255,0.3)',
        boxSizing: 'border-box',
        pointerEvents: 'none',
    } as CSSProperties;

    const main = {
        backgroundColor: color,
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        position: 'relative',
        boxSizing: 'border-box',
        transform: `rotate(${angle}deg)`,
        borderWidth: getNumberUnitCssValue(styleParameters.borderWidth),
        borderRadius: getNumberUnitCssValue(styleParameters.borderRadius),
        borderColor: styleParameters.borderColor,
        borderStyle: styleParameters.borderStyle,
        boxShadow: `${styleParameters.shadowInset ? 'inset ' : ''}${getVec2NumberUnitCssValue(shadowXYOffset, SizeUnit.px)} ${getNumberUnitCssValue(styleParameters.shadowBlur)} ${getNumberUnitCssValue(styleParameters.shadowSpread)} ${styleParameters.shadowColor}`,
        backgroundImage: imageBG ? `url(${imageBG})` : undefined,
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,
    } as CSSProperties;

    const children = {
        width: `100%`,
        height: `100%`,
        position: 'absolute',
    } as CSSProperties;

    const text = {
        fontSize: styleParameters.fontSize?.join('') || '',
        fontFamily: "'" + fontFamily + "'",
        fontStyle: styleParameters.fontStyle,
        fontWeight: styleParameters.fontWeight,
        color: styleParameters.textColour,
        position: 'absolute',
        left: [textPosition[0][0], textPosition[0][1] || SizeUnit.px].join(''),
        top: [textPosition[1][0], textPosition[1][1] || SizeUnit.px].join(''),
        pointerEvents: 'none',
        textShadow: `${getVec2NumberUnitCssValue(textShadowXYOffset, SizeUnit.px, ' ')} ${[styleParameters.textShadowBlur?.[0] || 0, styleParameters.textShadowBlur?.[1] || SizeUnit.px].join('')} ${styleParameters.textShadowColor}`
    } as CSSProperties;

    return { origin, pointerOrigin, main, text, borderInactive, children, borderMain, borderOrigin, borderLeaf };
};