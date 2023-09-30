import { Asset, AssetType } from "../../../store/currentProject/assets/types";
import { useEditorDispatch, useEditorSelector } from "../../../store";
import { addAsset, removeAsset, selectFonts, selectImages, updateAssets } from "../../../store/currentProject/assets";
import { useCallback, useEffect } from "react";

export const useAssets = (assetType: AssetType) => {

    const dispatch = useEditorDispatch();

    // useEffect(() => {
    //     dispatch(updateAssets(assetType));
    // }, [assetType]);

    const assets = useEditorSelector({
        images: selectImages,
        fonts: selectFonts
    }[assetType]);

    const handleFile = useCallback(async (files: FileList) => {

        if (files?.[0]) {
            const file: File = files?.[0];

            dispatch(addAsset(assetType, {
                data: {
                    blob: file,
                    name: file.name,
                    size: file.size,
                }
            }));
        }
    }, []);

    const handleRemove = useCallback(async (asset: Asset) => {
        dispatch(removeAsset(assetType, asset.id));
    }, []);

    return {
        assets,
        handleFile,
        handleRemove,
    }
};