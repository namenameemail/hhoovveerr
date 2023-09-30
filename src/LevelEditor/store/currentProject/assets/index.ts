import { AnyAction, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { Asset, Assets, AssetType } from "./types";
import { AppState } from "../../types";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';
import { fontsStore, imagesStore } from "../../../services/db/stores/assets";
import { AssetDbItem } from "../../../services/db/helpers/createAssetsStore";
import { Tree } from "../tree/types";


const initialState: Assets = {
    images: [],
    fonts: []
};


export const storeByAssetType = {
    images: imagesStore,
    fonts: fontsStore,
};

export const assetsSlice = createSlice({
    name: 'assets',
    initialState,
    reducers: {
        setAssetsState: (state: Assets, action: PayloadAction<Assets>) => {
            state = action.payload;
        },
        setAssets: (state: Assets, action: PayloadAction<{ assets: Asset[], assetType: AssetType }>) => {
            const { assetType, assets } = action.payload;
            state[assetType] = assets;

            switch (assetType) {
                case 'fonts':
                    assets.forEach(({ name, objectUrl }) => {
                        const fontFace = new FontFace(name, 'url(' + objectUrl + ')');
                        fontFace.load();
                        fontFace.loaded
                            .then((e) => {
                                document.fonts.add(fontFace);
                            })
                            .catch((e) => console.log(e));
                    });
                    break;

            }
        },
    },
});
export const { setAssetsState } = assetsSlice.actions;
export const selectImages = (state: AppState) => state.currentProject.assets.images;
export const selectFonts = (state: AppState) => state.currentProject.assets.fonts;

export const addAsset = (
    assetType: AssetType,
    { data }: {
        data: {
            blob: Blob
            name: string
            size: number
        }
    }
): ThunkAction<void, AppState, unknown, AnyAction> => async (dispatch, getState) => {

    const projectId = getState().currentProjectId;

    if (projectId) {
        await storeByAssetType[assetType].put({ ...data, projectId });

        dispatch(updateAssets(assetType));
    }
};
export const removeAsset = (assetType: AssetType, id: number): ThunkAction<void, AppState, unknown, AnyAction> => async (dispatch, getState) => {

    await storeByAssetType[assetType].remove(id);

    dispatch(updateAssets(assetType));

};

export const updateAssets = (assetType: AssetType): ThunkAction<void, AppState, unknown, AnyAction> => async (dispatch, getState) => {
    let state = getState();

    const currentProjectId = state.currentProjectId

    if (!currentProjectId) {
        return;
    }

    //revoke old urls
    const oldAssetImages: Asset[] = state.currentProject.assets.images;
    oldAssetImages.forEach(({ objectUrl }) => URL.revokeObjectURL(objectUrl));

    const assets: AssetDbItem[] = await storeByAssetType[assetType].getAll(currentProjectId);

    dispatch(
        assetsSlice.actions.setAssets(
            {
                assetType,
                assets: assets.map(
                    ({ id, blob, name, size }) => ({
                        id,
                        name,
                        size,
                        objectUrl: URL.createObjectURL(blob)
                    })
                )
            }
        )
    );
};

export const updateAllAssets = (): ThunkAction<void, AppState, unknown, AnyAction> => async (dispatch, getState) => {
    ['images', 'fonts'].forEach((type) => {
        dispatch(updateAssets(type as AssetType))
    })
};

