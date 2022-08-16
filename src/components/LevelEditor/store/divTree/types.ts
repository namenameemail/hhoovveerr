
export type Vec = [number, number]
export type CssSize = [string, string]


export interface DivTreeState {
    root: DivState
}

export type DivStyleParameters = {
    color?: string
    borderWidth?: number
    borderRadius?: number
    borderStyle?: string
    borderColor?: string
    zIndex?: number
    blendMode?: string
    text?: string
    textPosition?: [number, number]
    fontSize?: string
    font?: string
    fontStyle?: string
    fontWeight?: string
    textColour?: string
    shadowXYOffset?: [number, number]
    shadowSpread?: number
    shadowBlur?: number
    shadowColor?: string
    shadowInset?: boolean
    textShadowXYOffset?: [number, number]
    textShadowBlur?: number
    textShadowColor?: string

    backgroundImageName?: string
}

export enum SizeUnit {
    px = 'px',
    pc = '%',
    vw = 'vw',
    vh = 'vh',
}
export type DivParameters = DivStyleParameters & {
    startPoint: Vec;
    size: Vec;
    angle: number;

    sizeXUnit: SizeUnit
    sizeYUnit: SizeUnit
    startXUnit: SizeUnit
    startYUnit: SizeUnit
    //
    // relativeSizeX?: boolean
    // relativeSizeY?: boolean
    // relativeStartX?: boolean
    // relativeStartY?: boolean

}


export interface DivState {
    parameters: DivParameters

    children: DivState[];
}
