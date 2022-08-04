
export type BorderParams = {
    width: number
    type: string
    color: string
}

export enum Layout {
    Center = 'center',
    TopLeft = 'top-left'
}
export interface GameParams {
    layout: Layout
    background: string
}