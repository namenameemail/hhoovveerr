import styles from './styles.module.css';
import cn from 'classnames';
import { File as FileInput, useClickOutside } from 'bbuutoonnss';
import { ComponentType, useCallback, useRef, useState } from "react";
import { useEditorDispatch } from "../../../../store";
// @ts-ignore
import { saveAs } from 'file-saver';
import { Asset, AssetType } from "../../../../store/currentProject/assets/types";
import { useAssets } from "../../hooks/useAssets";

export interface AssetBrowserProps {
    className?: string;
    assetType: AssetType
    assetComponent: ComponentType<{
        asset: Asset;
        onDelete: (asset: Asset) => void
    }>;
}

export function AssetBrowser(props: AssetBrowserProps) {

    const {
        className,
        assetType,
        assetComponent: AssetComponent
    } = props;

    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => {
        setOpen(!open);
    }, [open]);

    const elRef = useRef<HTMLDivElement>(null);
    const dispatch = useEditorDispatch();

    useClickOutside(elRef, () => {
        setOpen(false);
    });
    useClickOutside(elRef, () => {
        setOpen(false);
    }, 'mouseup');


    const { handleFile, handleRemove, assets } = useAssets(assetType)


    return (
        <div className={cn({ [styles.open]: open }, styles.imageBrowser, className)}
             ref={elRef}
        >
            <div className={styles.handler} onClick={handleToggle}>
                {assetType} <small>({assets.length})</small>
            </div>
            <div className={cn(styles.content)}>
                <div>
                    <FileInput
                        name={assetType + '-input'}
                        className={styles.fileInput}
                        onChange={handleFile}
                    >+</FileInput>
                </div>
                <div className={styles.images}>
                    {assets.slice(0).reverse().map((asset) => {
                        return (
                            <AssetComponent
                                asset={asset}
                                onDelete={handleRemove}
                            />
                        )
                    })}
                </div>
            </div>

        </div>
    );
}

