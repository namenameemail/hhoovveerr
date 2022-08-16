import styles from './styles.module.css';
import cn from 'classnames';
import { File as FileInput, readImageFile, Button, saveJson } from 'bbuutoonnss';
import { useCallback, useEffect, useRef, useState } from "react";
import { useEditorDispatch, useEditorSelector } from "../../store";
import {
    addFont,
    addImage, removeFont,
    removeImage,
    selectFonts,
    selectImages,
    updateFonts,
    updateImages
} from "../../store/assets";
import JSZip from "jszip";
// @ts-ignore
import { saveAs } from 'file-saver';
import { AssetImage } from "../../store/assets/types";
import { selectDivTreeRoot } from "../../store/divTree";
import { DivState } from "../../store/divTree/types";
import html from './index.html?raw';
import { GameParams } from "../../store/gameParams/types";
import { selectGameParams } from "../../store/gameParams";

export interface ImageBrowserProps {
    className?: string;
}

async function downloadTestZip(images: AssetImage[], root: DivState, gameParams: GameParams) {
    const zip = new JSZip();

    const canvasElement = document.createElement('canvas');
    const ctx = canvasElement.getContext('2d');
    images.forEach((assetImage) => {
        const img = zip.folder("site/images");
        const imageElement = document.createElement('img');
        imageElement.src = assetImage.objectUrl;
        canvasElement.width = imageElement.width;
        canvasElement.height = imageElement.height;
        ctx?.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
        img?.file(assetImage.name.toString(), new Promise(res => canvasElement.toBlob(res)));
    });


    const site = zip.folder("site");

    const dataString = JSON.stringify({ images, root, gameParams });

    let text = html;
    const index = html.indexOf('{ "jsonPlaceHolder": "" }');
    text = text.slice(0, index) + dataString + text.slice(index + '{ "jsonPlaceHolder": "" }'.length);
    site?.file('index.html', text);

    zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(content, "example.zip");
    });
}


// export const readBlobFileAsText = (file: File): Promise<string> => {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             resolve(event.target.result as unknown as Blob);
//         };
//         if (file) {
//             reader.readAsText(file);
//         } else {
//             reject();
//         }
//     });
// };

export function ImageBrowser(props: ImageBrowserProps) {

    const { className } = props;


    const dispatch = useEditorDispatch();
    const root = useEditorSelector(selectDivTreeRoot);
    const gameParams = useEditorSelector(selectGameParams);
    const images = useEditorSelector(selectImages);
    const fonts = useEditorSelector(selectFonts);

    useEffect(() => {
        dispatch(updateImages());
    }, []);

    useEffect(() => {
        dispatch(updateFonts());
    }, []);


    const onNewImage = useCallback(async (files: FileList) => {
        if (files?.[0]) {
            const file: File = files?.[0];

            console.log(file);
            // const blob: string = await readBlobFileAsText(file);
            dispatch(addImage({
                data: {
                    blob: file,
                    name: file.name,
                    size: file.size,
                }
            }));
        }
    }, []);

    const onNewFont = useCallback(async (files: FileList) => {
        if (files?.[0]) {
            const file: File = files?.[0];

            console.log(file);
            // const blob: string = await readBlobFileAsText(file);
            dispatch(addFont({
                data: {
                    blob: file,
                    name: file.name,
                    size: file.size,
                }
            }));
        }
    }, []);
    const onDownloadZip = useCallback(() => {
        downloadTestZip(images, root, gameParams);
    }, [images, root, gameParams]);

    return (
        <div className={cn(styles.imageBrowser, className)}>
            <div>
                <FileInput name={'imageBrowser1'} onChange={onNewImage}>изображение</FileInput>
                <FileInput name={'imageBrowser2'} onChange={onNewFont}>шрифт</FileInput>
                <Button onClick={onDownloadZip}>export</Button>
            </div>
            <div className={styles.images}>
                {images.map(({ objectUrl, name, size }) => {
                    return (
                        <div className={styles.image} key={name}>
                            <img src={objectUrl} width={30} height={30}/>
                            <div className={styles.imageName}>{name}</div>
                            {/*<div>{size}</div>*/}
                            <button onClick={() => {
                                dispatch(removeImage(name));
                            }}>del
                            </button>
                        </div>
                    );
                })}
            </div>
            <div className={styles.images}>
                {fonts.map(({ objectUrl, name, size }) => {
                    return (
                        <div className={styles.image} key={name}>
                            <div className={styles.imageName} style={{ fontFamily: "'" + name + "'" }}>{name}</div>
                            {/*<div>{size}</div>*/}
                            <button onClick={() => {
                                dispatch(removeFont(name));
                            }}>del
                            </button>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

