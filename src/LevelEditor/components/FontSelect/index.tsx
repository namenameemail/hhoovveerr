import styles from './styles.module.css';
import cn from 'classnames';
import { BlurEnterTextInput } from 'bbuutoonnss';
import { File as FileInput, readImageFile, Button, saveJson } from 'bbuutoonnss';
import { useCallback, useEffect, useRef, useState } from "react";
import JSZip from "jszip";
// @ts-ignore
import { saveAs } from 'file-saver';
import { forField } from "../../../components/For/hoc/forField";
import { useReadAssets } from "../Assets/hooks/useReadAssets";

export interface FontSelectProps {
    className?: string;
    name: string;
    value: number;
    title?: string;
    placeholder?: string;
    onChange?: (value: number, name?: string) => void;
}

export function FontSelect(props: FontSelectProps) {

    const { className, onChange, value, name, placeholder, title } = props;

    const [focused, setFocused] = useState(false);
    const [listFocused, setListFocused] = useState(false);

    const { assets: fonts, selectedAsset } = useReadAssets('fonts', value);


    // const handleTextChange = useCallback((value: string) => {
    //     onChange?.(value, name);
    // }, [onChange, name]);


    const handleFontClick = useCallback((id: number) => {
        onChange?.(id, name);
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
                value={selectedAsset?.name || ''}
                changeOnEnter
                resetOnBlur
                onChange={() => {}}
                onFocus={handleFocus}
                onBlur={handleBlur}
                title={title}
                placeholder={placeholder}
            />
            {(focused || listFocused) && (
                <div
                    className={styles.fonts}
                >
                    {fonts.map(({ objectUrl, name, id, size }) => {
                        return (
                            <div className={styles.font} key={name} onClick={() => handleFontClick(id)}>
                                <div style={{ fontFamily: "'"+name+"'" }} className={styles.name}>{name}</div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}

export const FontSelectFor = forField<number, Omit<FontSelectProps, 'value' | 'onChange'>>(FontSelect);