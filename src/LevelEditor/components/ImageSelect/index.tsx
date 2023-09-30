import styles from './styles.module.css';
import cn from 'classnames';
import { BlurEnterTextInput } from 'bbuutoonnss';
import { useCallback, useEffect, useRef, useState } from "react";
import { useEditorDispatch, useEditorSelector } from "../../store";
// @ts-ignore
import { saveAs } from 'file-saver';
import { forField } from "../../../components/For/hoc/forField";
import { useReadAssets } from "../Assets/hooks/useReadAssets";

export interface ImageSelectProps {
    className?: string;
    name: string;
    value: number;
    placeholder?: string;
    title?: string;
    onChange?: (imageId: number, name?: string) => void;
}

export function ImageSelect(props: ImageSelectProps) {

    const { className, onChange, value, name, placeholder, title } = props;

    const [focused, setFocused] = useState(false);
    const [listFocused, setListFocused] = useState(false);

    const { assets: images, selectedAsset } = useReadAssets('images', value);

    //
    // const handleTextChange = useCallback((value: string) => {
    //     setText(value)
    //     console.log(1111, value)
    //     onChange?.(value, name);
    // }, [onChange, name]);
    //

    const handleImageClick = useCallback((imageId: number) => {
        onChange?.(imageId, name);
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
        <div className={cn(styles.imageSelect, className)}

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
                placeholder={placeholder}
                title={title}
            />
            {(focused || listFocused) && (
                <div
                    className={styles.images}
                >
                    {images.map(({ objectUrl, name, id, size }, index) => {
                        return (
                            <div className={styles.image} key={index} onClick={() => handleImageClick(id)}>
                                <img src={objectUrl} width={30} height={30}/>
                                <div className={styles.name}>
                                    {name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

        </div>
    );
}

export const ImageSelectFor = forField<number, Omit<ImageSelectProps, 'value' | 'onChange'>>(ImageSelect);