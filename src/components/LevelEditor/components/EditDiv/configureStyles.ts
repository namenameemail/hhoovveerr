import { CSSProperties } from "react";
import { DivParameters, SizeUnit, Vec } from "../../store/divTree/types";
import { AssetImage } from "../../store/assets/types";

export interface DivStyles {
    origin: CSSProperties,
    main: CSSProperties,
    text: CSSProperties,
    children: CSSProperties,
    borderMain: CSSProperties,
    borderOrigin: CSSProperties,
    borderLeaf: CSSProperties,
    borderInactive: CSSProperties,
}

export const getSize = (value: number, unit: SizeUnit, rootSize: Vec) => {
    if (unit === SizeUnit.vw) {
        return value / 100 * rootSize[0] + SizeUnit.px
    }
    if (unit === SizeUnit.vh) {
        return value / 100 * rootSize[1] + SizeUnit.px
    }
    return value + unit
}

export const getStyles = (state: DivParameters, isBlendActive: boolean, images: AssetImage[], rootSize: Vec, isRoot?: boolean): DivStyles => {

    const {
        color,
        size = [0, 0],
        borderWidth = 0,
        startPoint = [0, 0],
        shadowXYOffset = [0, 0],
        backgroundImageName,
        textShadowXYOffset = [0, 0],
        textPosition = [0, 0],
        sizeXUnit,
        sizeYUnit,
        startXUnit,
        startYUnit,
    } = state;

    console.log(222,rootSize)
    // const [relativeSizeX, relativeSizeY] = [sizeXUnit === SizeUnit.pc, sizeYUnit === SizeUnit.pc];
    // const [relativeStartX, relativeStartY] = [startXUnit === SizeUnit.pc, startYUnit === SizeUnit.pc];
    const imageBG = backgroundImageName ? images.find(({name}) => name === backgroundImageName)?.objectUrl || '' : ''

    const origin = {
        width: `calc(${getSize(size[0], sizeXUnit, rootSize)} + ${2 * borderWidth}px)`,
        height: `calc(${getSize(size[1], sizeYUnit, rootSize)} + ${2 * borderWidth}px)`,
        left: `calc(${getSize(startPoint[0], startXUnit, rootSize)} - ${borderWidth}px)`,
        top: `calc(${getSize(startPoint[1], startYUnit, rootSize)} - ${borderWidth}px)`,
        zIndex: state.zIndex,
        mixBlendMode: isBlendActive ? state.blendMode : 'normal',
        position: isRoot ? 'relative' : 'absolute',
        display: 'flex'
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
        background: color,
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        position: 'relative',
        boxSizing: 'border-box',
        transform: `rotate(${state.angle}deg)`,
        borderWidth: state.borderWidth,
        borderRadius: state.borderRadius,
        borderColor: state.borderColor,
        borderStyle: state.borderStyle,
        boxShadow: `${state.shadowInset ? 'inset ' : ''}${shadowXYOffset[0]}px ${shadowXYOffset[1]}px ${state.shadowBlur}px ${state.shadowSpread}px ${state.shadowColor}`,
        backgroundImage: imageBG ? `url(${imageBG})` : undefined,
    } as CSSProperties;

    const children = {
        // background: color,
        width: `calc(100% + ${2 * 0}px)`,
        height: `calc(100% + ${2 * 0}px)`,
        left: -0 + 'px',
        top: -0 + 'px',

        // cursor: 'pointer',
        position: 'absolute',
    } as CSSProperties;

    const text = {
        fontSize: state.fontSize,
        fontFamily: "'" + state.font + "'",
        fontStyle: state.fontStyle,
        fontWeight: state.fontWeight,
        color: state.textColour,
        position: 'absolute',
        left: textPosition[0],
        top: textPosition[1],
        pointerEvents: 'none',
        textShadow: `${textShadowXYOffset[0]}px ${textShadowXYOffset[1]}px ${state.textShadowBlur}px ${state.textShadowColor}`
    } as CSSProperties;

    return { origin, main, text, borderInactive, children, borderMain, borderOrigin, borderLeaf };
};