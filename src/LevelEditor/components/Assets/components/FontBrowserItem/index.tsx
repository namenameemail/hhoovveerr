import styles from './styles.module.css';
import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from "react";
// @ts-ignore
import { saveAs } from 'file-saver';
import { Asset } from "../../../../store/currentProject/assets/types";

export interface ImageBrowserItemProps {
    className?: string;
    asset: Asset;
    onDelete: (asset: Asset) => void
}

export function FontBrowserItem(props: ImageBrowserItemProps) {

    const { className, asset, onDelete } = props;

    const {objectUrl, name, id, size} = asset

    const handleDelete = useCallback(() => {
        onDelete(asset)
    }, [asset, onDelete]);


    return (
        <div className={cn(styles.font, className)}>
            <div className={styles.name} style={{ fontFamily: "'" + name + "'" }}>{name}</div>
            {/*<div>{size}</div>*/}
            <button onClick={handleDelete}>del
            </button>
        </div>
    );
}

