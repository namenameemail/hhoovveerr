
export interface AssetImage {
    objectUrl: string
    name: string
    // id: number
    size: number
}
export interface AssetFont {
    objectUrl: string
    name: string
    // id: number
    size: number
}
export interface Assets {
    images: AssetImage[]
    fonts: AssetFont[]
}