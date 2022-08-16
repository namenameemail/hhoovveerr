import styles from '../styles.module.css';
import cn from 'classnames';
import { BrushState, BrushStyleParameters } from "../../../store/brushes/types";
import React, { useCallback, useMemo } from "react";
import { getRandomColor } from "bbuutoonnss";
import { useEditorDispatch, useEditorSelector } from "../../../store";
import { selectIsEditing, toggleEditorOpen, updateBrushStyleParameters } from "../../../store/brushes";
import { BlurEnterTextInputFor, For, NumberDragPointerLockFor, Vec2DragPointerLockFor } from "../../../../For";
import { SelectArrayFor } from "../../../../For/components/SelectArrayFor";
import { blendModes, borderTypes } from "../../../const";


export interface BrushProps {
    className?: string;
    state: BrushState;
    index: number;
    onClick?: (index: number, state: BrushState) => void;
    isCurrent?: boolean;
}

export function Brush(props: BrushProps) {

    const { className, state, onClick, index, isCurrent } = props;


    const dispatch = useEditorDispatch()
    const editorOpen = useEditorSelector(selectIsEditing)

    const {
        color,
        randomColor,
    } = state.brushStyleParameters || {};
    const style = useMemo(() => ({
        width: 30,
        height: 30,
        background: color || 'white',

    }), [color, randomColor, isCurrent]);

    const handleClick = useCallback(() => {
        onClick?.(index, state);
    }, [onClick, index, state]);
    const handleDoubleClick = useCallback(() => {
        dispatch(toggleEditorOpen());
    }, []);
    const handleChange = useCallback((brushStyleParameters: BrushStyleParameters) => {
        dispatch(updateBrushStyleParameters({ index, brushStyleParameters }));
    }, [index]);
    return (
        <div className={cn(className, {
            [styles.currentBrush]: isCurrent
        })}
             onClick={handleClick}
            onDoubleClick={handleDoubleClick}>

            {isCurrent &&  editorOpen && (
            <For<BrushStyleParameters>

                className={styles.brushForm}
                value={state.brushStyleParameters || {}}
                onChange={handleChange}>
                <BlurEnterTextInputFor name={'color'}></BlurEnterTextInputFor>
                <NumberDragPointerLockFor name={'borderWidth'} min={0}></NumberDragPointerLockFor>
                <NumberDragPointerLockFor name={'borderRadius'} min={0}></NumberDragPointerLockFor>
                <SelectArrayFor name={'borderStyle'} options={borderTypes} title={'borderStyle'}></SelectArrayFor>
                <BlurEnterTextInputFor name={'borderColor'}></BlurEnterTextInputFor>
                <SelectArrayFor name={'blendMode'} options={blendModes} title={'blendMode'}></SelectArrayFor>

                <Vec2DragPointerLockFor name={'shadowXYOffset'}/>
                <NumberDragPointerLockFor name={'shadowBlur'} min={0}></NumberDragPointerLockFor>
                <NumberDragPointerLockFor name={'shadowSpread'} min={0}></NumberDragPointerLockFor>

                <BlurEnterTextInputFor name={'shadowColor'}></BlurEnterTextInputFor>


            </For>
            )}
            <div
                style={style}>
                {randomColor && 'rand'}
            </div>
        </div>
    );
}

