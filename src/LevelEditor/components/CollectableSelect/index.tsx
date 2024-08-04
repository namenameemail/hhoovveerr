import styles from './styles.module.css';
import cn from 'classnames';
import { BlurEnterTextInput } from 'bbuutoonnss';
import { useCallback, useEffect, useRef, useState } from "react";
import { useEditorDispatch, useEditorSelector } from "../../store";
// @ts-ignore
import { saveAs } from 'file-saver';
import { forField } from "../../../components/For/hoc/forField";
import { useReadAssets } from "../Assets/hooks/useReadAssets";
import {
    selectActiveDivId,
    selectCollectableIds,
    selectIdsPathById,
    selectTreeRootId
} from "../../store/currentProject/tree";
import { DivId } from "../../store/currentProject/tree/types";
import { EditDiv } from "../EditDiv";
import { ViewDiv } from "../ViewDiv";

export interface CollectableSelectProps {
    className?: string;
    name: string;
    value: DivId[];
    placeholder?: string;
    title?: string;
    onChange?: (value: DivId[], name: string) => void;
    onAdd?: (id: DivId, name: string) => void;
}

export function CollectableSelect(props: CollectableSelectProps) {

    const activeElementId = useEditorSelector(selectActiveDivId);
    const activePath = useEditorSelector(selectIdsPathById(activeElementId as string));
    const rootId = useEditorSelector(selectTreeRootId);

    const { className, onChange, onAdd, value, name, placeholder, title } = props;

    const [focused, setFocused] = useState(false);
    const [listFocused, setListFocused] = useState(false);

    const collectableIds = useEditorSelector(selectCollectableIds);

    //
    // const handleTextChange = useCallback((value: string) => {
    //     setText(value)
    //     console.log(1111, value)
    //     onChange?.(value, name);
    // }, [onChange, name]);
    //
    //
    // const handleImageClick = useCallback((imageId: number) => {
    //     onChange?.(imageId, name);
    // }, [onChange, name]);

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

    const handleSelect = useCallback((id: string) => {
        onChange?.(
            [
                ...(value?.filter((valueId) => valueId !== id) || []),
                id
            ],
            name
        );
        if (!value.includes(id)) {
            onAdd?.(id, name);
        }
    }, [onChange, onAdd, name, value]);

    const handleRemove = useCallback((id: string) => {
        onChange?.(
            [
                ...(value?.filter((valueId) => valueId !== id) || []),
            ],
            name
        );
    }, [onChange, name, value]);

    return (
        <div
            className={cn(styles.collectableSelect, className)}

            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <div
                className={styles.value}
            >
                {value?.map((divId) => {
                    return (
                        <ViewDiv
                            isSelectorItem
                            id={divId}
                            activePath={activePath}
                            onClick={handleRemove}
                        />
                    );
                })}
            </div>
            {/*{focused || listFocused ? 1 : 2}*/}
            {(focused || listFocused || true) && (
                <div
                    className={styles.allCollectables}
                >
                    {collectableIds.map((divId, index) => {
                        return (
                            <ViewDiv
                                onClick={handleSelect}
                                isSelectorItem
                                id={divId}
                                // isRoot
                                activePath={activePath}
                            />
                        );
                    })}
                </div>
            )}

        </div>
    );
}

export const CollectableSelectFor = forField<DivId[], Omit<CollectableSelectProps, 'value' | 'onChange'>>(CollectableSelect);