import { Asset, AssetType } from "../../../store/currentProject/assets/types";
import { useEditorDispatch, useEditorSelector } from "../../../store";
import { addAsset, removeAsset, selectFonts, selectImages, updateAssets } from "../../../store/currentProject/assets";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useReadAssets = (assetType: AssetType, selectedId?: number, filter?: string) => {

    const assets = useEditorSelector({
        images: selectImages,
        fonts: selectFonts
    }[assetType]);

    const [filteredAssets, setFilteredAssets] = useState(assets)

    useEffect(() => {
        if (filter) {
            setFilteredAssets(assets.filter(({name}) => name.indexOf(filter) !== -1))
        } else {
            setFilteredAssets(assets)
        }
    }, [filter, assets])

    const selectedAsset = useMemo(() => {
        if (selectedId) {
            return assets.find(({id}) => id === selectedId)
        } else {
            return undefined
        }
    }, [assets, selectedId])

    return {
        assets,
        filteredAssets,
        selectedAsset
    }
};