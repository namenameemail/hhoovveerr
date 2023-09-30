import { CSSProperties } from "react";
import {
    DivBehaviourParameters,
    DivPositionParameters,
    DivStyleParameters, ReceivableCollectableParameters,
    SizeUnit,
    Vec
} from "../../../store/currentProject/tree/types";
import { Asset } from "../../../store/currentProject/assets/types";
import { getSize } from "../../EditDiv/helpers/configureStyles";
import { getNumberUnitCssValue, getVec2NumberUnitCssValue } from "../../../utils/css";

export interface DivStyles {
    main: CSSProperties,
    text: CSSProperties,
}


export type StylesConfig = {
    styleParameters: DivStyleParameters
    positionParameters: DivPositionParameters
    behaviourParameters: DivBehaviourParameters
    isBlendActive: boolean,
    images: Asset[],
    fonts: Asset[],
    rootSize: Vec,
    isRoot?: boolean
    isInventoryItem?: boolean
    isSelectorItem?: boolean
    isReceivedDiv?: boolean
    receiveParameters?: ReceivableCollectableParameters;
}

export const getStyles = (stylesConfig: StylesConfig): DivStyles => {
    const {
        positionParameters,
        behaviourParameters,
        styleParameters,
        isBlendActive,
        images,
        fonts,
        rootSize,
        isRoot,
        isInventoryItem,
        isSelectorItem,
        isReceivedDiv,
        receiveParameters,
    } = stylesConfig;


    const {
        size = [[0, SizeUnit.px], [0, SizeUnit.px]],
        startPoint = [[0, SizeUnit.px], [0, SizeUnit.px]],
        angle = 0,
    } = positionParameters;


    const {
        collectableParameters: {
            inventorySize = [[0, SizeUnit.px], [0, SizeUnit.px]],
        },
    } = behaviourParameters;
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
        zIndex,
    } = styleParameters;

    const imageBG = backgroundImageId ? images.find(({ id }) => id === backgroundImageId)?.objectUrl || '' : '';
    const fontFamily = fontId ? fonts.find(({ id }) => id === fontId)?.name || '' : '';

    const width = `calc(${getSize(size[0][0], size[0][1], rootSize)} + ${2 * borderWidth[0]}${borderWidth[1] || SizeUnit.px})`,
        height = `calc(${getSize(size[1][0], size[1][1], rootSize)} + ${2 * borderWidth[0]}${borderWidth[1] || SizeUnit.px})`,
        left = `calc(${getSize(startPoint[0][0], startPoint[0][1], rootSize)} - ${getNumberUnitCssValue(borderWidth)})`,
        top = `calc(${getSize(startPoint[1][0], startPoint[1][1], rootSize)} - ${getNumberUnitCssValue(borderWidth)})`;
    const inventoryWidth = `calc(${getSize(inventorySize[0][0], inventorySize[0][1], rootSize)})`,
        inventoryHeight = `calc(${getSize(inventorySize[1][0], inventorySize[1][1], rootSize)})`;


    const main = {
        backgroundColor: color,
        ...(isInventoryItem ? {
            width: inventoryWidth,
            height: inventoryHeight,
        } : {}),
        ...(isSelectorItem ? {
            width: inventoryWidth,
            height: inventoryHeight,
        } : {}),
        ...(isReceivedDiv && receiveParameters ? {
            width: `calc(${getSize(receiveParameters.size[0][0], receiveParameters.size[0][1], rootSize)})`,
            height: `calc(${getSize(receiveParameters.size[1][0], receiveParameters.size[1][1], rootSize)})`,
            left: `calc(${getSize(receiveParameters.startPoint[0][0], receiveParameters.startPoint[0][1], rootSize)})`,
            top: `calc(${getSize(receiveParameters.startPoint[1][0], receiveParameters.startPoint[1][1], rootSize)})`,
        } : {}),
        ...(!isSelectorItem && !isInventoryItem && !(isReceivedDiv && receiveParameters) ? {
            width,
            height,
            left,
            top,
        } : {}),
        zIndex,
        position: isRoot || isSelectorItem || isInventoryItem ? 'relative' : 'absolute',
        display: 'flex',
        boxSizing: 'border-box',

        transform: `rotate(${angle}deg)`,
        borderWidth: getNumberUnitCssValue(styleParameters.borderWidth),
        borderRadius: getNumberUnitCssValue(styleParameters.borderRadius),
        borderColor: styleParameters.borderColor,
        borderStyle: styleParameters.borderStyle,
        boxShadow: `${styleParameters.shadowInset ? 'inset ' : ''}${getVec2NumberUnitCssValue(shadowXYOffset, SizeUnit.px)} ${getNumberUnitCssValue(styleParameters.shadowBlur)} ${getNumberUnitCssValue(styleParameters.shadowSpread)} ${styleParameters.shadowColor}`,
        mixBlendMode: isBlendActive ? styleParameters.blendMode : 'normal',
        backgroundImage: imageBG ? `url(${imageBG})` : undefined,
        backgroundPosition,
        backgroundRepeat,
        backgroundSize,
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
        textShadow: `${getVec2NumberUnitCssValue(textShadowXYOffset, SizeUnit.px)} ${getNumberUnitCssValue(styleParameters.textShadowBlur)} ${styleParameters.textShadowColor}`
    } as CSSProperties;

    return { main, text };
};