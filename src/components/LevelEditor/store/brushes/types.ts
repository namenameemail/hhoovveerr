import { DivState, DivStyleParameters } from "../divTree/types";

export interface BrushesState {
    brushes: BrushState[]
    currentBrushIndex: number
    editorOpen: boolean
}

export type BrushStyleParameters = DivStyleParameters & {
    randomColor?: boolean
}
export interface BrushState {
    brushStyleParameters?: BrushStyleParameters
    divState?: DivState
}