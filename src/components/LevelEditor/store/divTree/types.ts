
export type Vec = [number, number]
export type CssSize = [string, string]


export interface DivTreeState {
    root: DivState
    activePath: string
}

export type DivParameters = {
    startPoint: Vec;
    size: Vec;

    relativeSizeX?: boolean
    relativeSizeY?: boolean
    relativeStartX?: boolean
    relativeStartY?: boolean

    angle: number;
    color: string
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
}


export interface DivState {
    parameters: DivParameters

    children: DivState[];
}
