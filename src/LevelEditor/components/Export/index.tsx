import styles from './styles.module.css';
import cn from 'classnames';
import { Button } from 'bbuutoonnss';
import React, { useCallback, useRef, useState } from "react";
import { useEditorSelector } from "../../store";
import {
    selectFonts,
    selectImages,
} from "../../store/currentProject/assets";
import JSZip from "jszip";
// @ts-ignore
import { saveAs } from 'file-saver';
import { AssetFont, AssetImage } from "../../store/currentProject/assets/types";
import { selectTreeRoot } from "../../store/currentProject/tree";
import { Div } from "../../store/currentProject/tree/types";
import html from './index.html?raw';
import { GameParams } from "../../store/currentProject/gameParams/types";
import { selectGameParams } from "../../store/currentProject/gameParams";
import { For } from "../../../components/For";
import { useClickOutside } from "bbuutoonnss";
import { TextInputFor } from "../../../components/For/components/TextInputFor";
import { ImageSelect } from "../ImageSelect";

export interface ExportProps {
    className?: string;
}

const replace = (html: string, subString1: string, subString2: string) => {
    let text = html;
    const index = html.indexOf(subString1);
    text = text.slice(0, index) + subString2 + text.slice(index + subString1.length);
    return text;
};

async function downloadTestZip(filename: string, title: string, images: AssetImage[], fonts: AssetFont[], root: Div, gameParams: GameParams) {
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
        img?.file(assetImage.name.toString(), new Promise<Blob>(res => canvasElement.toBlob((blob) => blob && res(blob))));
    });
    await Promise.all(fonts.map(async (assetFont) => {
        const fontsFolder = zip.folder("site/fonts");
        let blob = await fetch(assetFont.objectUrl).then(r => r.blob());
        fontsFolder?.file(assetFont.name, blob, { binary: true });
    }));


    const site = zip.folder("site");

    const dataString = JSON.stringify({ images, fonts, root, gameParams });

    const JSON_PLACEHOLDER = '{ "jsonPlaceHolder": "" }';
    const TITLE_PLACEHOLDER = '<!--title-placeholder-->';

    let text = html;

    text = replace(text, JSON_PLACEHOLDER, dataString);
    text = replace(text, TITLE_PLACEHOLDER, title);

    site?.file('index.html', text);

    zip.generateAsync({ type: "blob" }).then(function (content) {
        saveAs(
            content,
            filename + (filename.substring(filename.length - 4) === ".zip" ? '' : '.zip')
        );
    });
}

export interface ExportParams {
    fileName: string;
    favicon: string;
    title: string;
}

export function Export(props: ExportProps) {

    const { className } = props;

    const [formState, setFormState] = useState<ExportParams>({ fileName: '', title: '', favicon: '' });

    const root = useEditorSelector(selectTreeRoot);
    const gameParams = useEditorSelector(selectGameParams);
    const images = useEditorSelector(selectImages);
    const fonts = useEditorSelector(selectFonts);

    const elRef = useRef<HTMLDivElement>(null);

    useClickOutside(elRef, () => {
        setOpen(false);
    });

    useClickOutside(elRef, () => {
        setOpen(false);
    }, 'mouseup');

    const onDownloadZip = useCallback(() => {
        root && downloadTestZip(formState.fileName, formState.title, images, fonts, root, gameParams);
    }, [formState, images, fonts, root, gameParams]);


    const [open, setOpen] = useState(false);

    const handleToggle = useCallback(() => {
        setOpen((open) => !open);
    }, []);
    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);
    const handleExport = useCallback(() => {
        onDownloadZip();
    }, [onDownloadZip]);


    const handleFaviconChange = useCallback((favicon: string) => {
        setFormState(state => ({
            ...state,
            favicon,
        }))
    }, [])

    return (
        <div ref={elRef} className={cn({ [styles.open]: open }, styles.export, className)}>
            <div className={styles.handler} onClick={handleToggle}>export</div>
            <div className={styles.modal}>
                <For
                    className={styles.form}
                    value={formState}
                    onChange={setFormState}
                >
                    <TextInputFor
                        changeOnBlur
                        name="fileName"
                        placeholder={'file name'}
                        title={'file name'}
                        className={styles.textInput}
                    />
                    <TextInputFor
                        changeOnBlur
                        name="title"
                        placeholder={'page title'}
                        title={'page title'}
                        className={styles.textInput}
                    />
                    <ImageSelect
                        name={'favicon'}
                        value={formState.favicon}
                        onChange={handleFaviconChange}
                        className={styles.textInput}
                    />
                </For>
                {/*<div className={styles.modal}>*/}

                {/*</div>*/}
                <div className={styles.buttons}>
                    <button onClick={handleExport}>export</button>
                </div>
            </div>
        </div>
    );
}

