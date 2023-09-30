import { AssetBrowser } from "../Assets/components/AssetBrowser";
import { ImageBrowserItem } from "../Assets/components/ImageBrowserItem";

export const ImageBrowser = () => {
    return <AssetBrowser assetType={'images'} assetComponent={ImageBrowserItem}/>
}