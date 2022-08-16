import styles from './styles.module.css';
import cn from 'classnames';
import { File, readImageFile , Button } from 'bbuutoonnss';
import { useCallback, useRef, useState } from "react";
import { useEditorDispatch, useEditorSelector } from "../../store";
import JSZip from "jszip";
// @ts-ignore
import { saveAs } from 'file-saver';
import { AssetImage } from "../../store/assets/types";
import { newBrush, selectBrushes, selectCurrentBrushIndex, setCurrentBrush } from "../../store/brushes";
import { Brush } from "./Brush";

export interface BrushesProps {
    className?: string;
}


export function Brushes(props: BrushesProps) {

    const { className } = props;

    const dispatch = useEditorDispatch();
    const brushes = useEditorSelector(selectBrushes);
    const currentBrushIndex = useEditorSelector(selectCurrentBrushIndex);

    const onBrushSelect = useCallback( (index: number) => {
       dispatch(setCurrentBrush({ index }))
    }, []);
    const handleNewBrush = useCallback( () => {
       dispatch(newBrush())
    }, []);

    return (
        <div className={cn(styles.brushesBlock, className)}>
            <div className={styles.brushes}>
                {brushes.map((state, index) => {
                    return (
                        <Brush key={index} className={styles.brush} isCurrent={currentBrushIndex === index} index={index} onClick={onBrushSelect} state={state}/>
                    );
                })}
            </div>
            <button onClick={handleNewBrush}>add</button>
        </div>
    );
}

