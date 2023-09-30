import { AssetBrowser } from "../Assets/components/AssetBrowser";
import { FontBrowserItem } from "../Assets/components/FontBrowserItem";

export const FontBrowser = () => {
    return <AssetBrowser assetType={'fonts'} assetComponent={FontBrowserItem}/>
}