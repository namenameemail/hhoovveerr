import styles from './styles.module.css';
import cn from 'classnames';
import { BlurEnterTextInput } from 'bbuutoonnss';
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
import { BlurEnterTextInputFor } from "../../../For";
import { forField } from "../../../For/hoc/forField";

export interface FontSelectProps {
    className?: string;
    name?: string;
    value: string;
    onChange?: (value: string, name?: string) => void;
}

export function FontSelect(props: FontSelectProps) {

    const { className, onChange, value, name } = props;

    const [focused, setFocused] = useState(false);
    const [listFocused, setListFocused] = useState(false);

    const dispatch = useEditorDispatch();
    const fonts = useEditorSelector(selectFonts);

    const handleTextChange = useCallback((value: string) => {
        console.log(1111, value)
        onChange?.(value, name);
    }, [onChange, name]);


    const handleImageClick = useCallback((imageName: string) => {
        onChange?.(imageName, name);
    }, [onChange, name]);

    const handleFocus = useCallback(() => {
        setFocused(true);
    }, []);
    const handleBlur = useCallback(() => {
        setFocused(false);
    }, []);

    const handleEnter = useCallback(() => {
        setListFocused(true);
    }, []);
    const handleLeave = useCallback(() => {
        setListFocused(false);
    }, []);

    return (
        <div className={cn(styles.fontSelect, className)}

             onMouseEnter={handleEnter}
             onMouseLeave={handleLeave}
        >
            <BlurEnterTextInput
                value={value}
                changeOnEnter
                resetOnBlur
                onChange={handleTextChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            {(focused || listFocused) && (
                <div
                    className={styles.fonts}
                >
                    {fonts.map(({ objectUrl, name, size }) => {
                        return (
                            <div className={styles.font} key={name} onClick={() => handleImageClick(name)}>
                                <div style={{ fontFamily: "'"+name+"'" }}>{name}</div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}

export const FontSelectFor = forField(FontSelect);