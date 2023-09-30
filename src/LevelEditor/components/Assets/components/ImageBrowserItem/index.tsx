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

export function ImageBrowserItem(props: ImageBrowserItemProps) {

    const { className, asset, onDelete } = props;

    const {objectUrl, name, id, size} = asset

    const handleDelete = useCallback(() => {
        onDelete(asset)
    }, [asset, onDelete]);


    return (
        <div className={cn(className)}>
            <div className={styles.image} key={name}>
                <img src={objectUrl} width={30} height={30}/>
                <div className={styles.imageName}>
                    {name}
                </div>
                {/*<div>{size}</div>*/}
                <button onClick={handleDelete}>del</button>
            </div>
        </div>
    );
}

