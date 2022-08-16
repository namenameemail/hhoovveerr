import { AnyAction, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { AssetFont, AssetImage, Assets } from "./types";
import { EditorState } from "../index";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { DBImage, deleteImage, getImages, putImage } from "./db/images";
import { DBFont, deleteFont, getFonts, putFont } from "./db/fonts";


const initialState: Assets = {
    images: [],
    fonts: []
};


export const assetsSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {
        setImages: (state: Assets, action: PayloadAction<AssetImage[]>) => {
            state.images = action.payload;
        },
        setFonts: (state: Assets, action: PayloadAction<AssetFont[]>) => {
            state.fonts = action.payload;
        },
    },
});

export const selectImages = (state: EditorState) => state.assets.images;
export const selectFonts = (state: EditorState) => state.assets.fonts;

export const addImage = ({ data }: {
    data: {
        blob: Blob
        name: string
        size: number
    }
}): ThunkAction<void, EditorState, unknown, AnyAction> => async (dispatch, getState) => {

    await putImage(data);

    dispatch(updateImages());

};
export const removeImage = (name: string): ThunkAction<void, EditorState, unknown, AnyAction> => async (dispatch, getState) => {

    await deleteImage(name);

    dispatch(updateImages());

};

export const updateImages = (): ThunkAction<void, EditorState, unknown, AnyAction> => async (dispatch, getState) => {

    //revoke old urls
    const oldAssetImages: AssetImage[] = getState().assets.images;
    oldAssetImages.forEach(({ objectUrl }) => URL.revokeObjectURL(objectUrl));

    const images: DBImage[] = await getImages();
    dispatch(assetsSlice.actions.setImages(images.map(({ blob, name, size }) => ({
            name, size, objectUrl: URL.createObjectURL(blob)
        })))
    );
};


export const addFont = ({ data }: {
    data: {
        blob: Blob
        name: string
        size: number
    }
}): ThunkAction<void, EditorState, unknown, AnyAction> => async (dispatch, getState) => {

    await putFont(data);

    dispatch(updateFonts());

};
export const removeFont = (name: string): ThunkAction<void, EditorState, unknown, AnyAction> => async (dispatch, getState) => {

    await deleteFont(name);

    dispatch(updateFonts());

};

export const updateFonts = (): ThunkAction<void, EditorState, unknown, AnyAction> => async (dispatch, getState) => {

    //revoke old urls
    const oldAssetFonts: AssetFont[] = getState().assets.images;
    oldAssetFonts.forEach(({ objectUrl }) => URL.revokeObjectURL(objectUrl));

    console.log(1111)
    const fonts: DBFont[] = await getFonts();
    dispatch(assetsSlice.actions.setFonts(
        fonts.map(({ blob, name, size }) => {
            const asset = {
                name, size, objectUrl: URL.createObjectURL(blob)
            };

            const fontFace = new FontFace(name, 'url('+asset.objectUrl+')');
            // console.log(fontFace)
            fontFace.load()
            fontFace.loaded
                .then((e) => {

                    document.fonts.add(fontFace);
                })
                .catch((e) => console.log(444, e));
            return asset;
        })
    ));
};