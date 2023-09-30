
export type AssetType = 'images' | 'fonts'

export interface Asset {
    objectUrl: string
    name: string
    id: number
    size: number
}

export interface Assets {
    images: Asset[]
    fonts: Asset[]
}