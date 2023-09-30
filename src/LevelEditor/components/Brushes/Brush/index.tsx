import styles from '../styles.module.css';
import cn from 'classnames';
import { BrushState, BrushStyleParameters } from "../../../store/currentProject/brushes/types";
import React, { useCallback, useMemo } from "react";
import { useEditorDispatch, useEditorSelector } from "../../../store";
import { selectIsEditing, toggleEditorOpen, updateBrushStyleParameters } from "../../../store/currentProject/brushes";
import {
    BlurEnterNumberInputFor,
    BlurEnterTextInputFor, CheckboxFor,
    For,
    NumberDragPointerLockFor,
} from "../../../../components/For";
import { SelectArrayFor } from "../../../../components/For/components/SelectArrayFor";
import { blendModes, borderTypes, sizeUnits } from "../../../const";
import { ImageSelectFor } from "../../ImageSelect";
import { FontSelectFor } from "../../FontSelect";
import { getStyles } from "./configureStyles";
import { selectImages } from "../../../store/currentProject/assets";


export interface BrushProps {
    className?: string;
    state: BrushState;
    index: number;
    onClick?: (index: number, state: BrushState) => void;
    isCurrent?: boolean;
}

export function Brush(props: BrushProps) {

    const { className, state, onClick, index, isCurrent } = props;


    const dispatch = useEditorDispatch();
    const editorOpen = useEditorSelector(selectIsEditing);
    const images = useEditorSelector(selectImages);

    const {
        color,
        randomColor,
    } = state.brushStyleParameters || {};
    const style = useMemo(() => getStyles(state.brushStyleParameters || {}, images).main, [state.brushStyleParameters, images]);

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
        })}>

            {isCurrent && editorOpen && (
                <For<BrushStyleParameters>

                    className={styles.brushForm}
                    value={state.brushStyleParameters || {}}
                    onChange={handleChange}
                >


                    <div>
                        <SelectArrayFor name={'startXUnit'} options={sizeUnits} title={'position x unit'}
                        ></SelectArrayFor>
                        <SelectArrayFor name={'startYUnit'} options={sizeUnits} title={'position y unit'}
                        ></SelectArrayFor>
                    </div>

                    <div>
                        <SelectArrayFor name={'sizeXUnit'} options={sizeUnits} title={'width unit'}
                        ></SelectArrayFor>
                        <SelectArrayFor name={'sizeYUnit'} options={sizeUnits} title={'height unit'}
                        ></SelectArrayFor>
                    </div>
                    <NumberDragPointerLockFor name={'angle'} min={0}>
                        <BlurEnterNumberInputFor name={'angle'} title={'angle'}
                                                 placeholder={'angle'}></BlurEnterNumberInputFor>
                    </NumberDragPointerLockFor>


                    <SelectArrayFor name={'blendMode'} options={blendModes} title={'blend mode'}></SelectArrayFor>

                    <div className={styles.header}>background</div>
                    <BlurEnterTextInputFor name={'color'} title={'background color'}
                                           placeholder={'background color'}></BlurEnterTextInputFor>
                    <BlurEnterTextInputFor name={'backgroundPosition'} title={'background position'}
                                           placeholder={'background position'}></BlurEnterTextInputFor>
                    <BlurEnterTextInputFor name={'backgroundRepeat'} title={'background repeat'}
                                           placeholder={'background repeat'}></BlurEnterTextInputFor>
                    <BlurEnterTextInputFor name={'backgroundSize'} title={'background size'}
                                           placeholder={'background size'}></BlurEnterTextInputFor>
                    <ImageSelectFor name={'backgroundImageId'} placeholder={'background image'} title={'background image'}/>


                    <div className={styles.header}>border</div>
                    <NumberDragPointerLockFor name={'borderWidth'} min={0}>
                        <BlurEnterNumberInputFor name={'borderWidth'} placeholder={'border width'}
                                                 title={'border width'}></BlurEnterNumberInputFor>
                    </NumberDragPointerLockFor>
                    <NumberDragPointerLockFor name={'borderRadius'} min={0}>
                        <BlurEnterNumberInputFor name={'borderRadius'} placeholder={'border radius'}
                                                 title={'border radius'}></BlurEnterNumberInputFor>
                    </NumberDragPointerLockFor>
                    <SelectArrayFor name={'borderStyle'} options={borderTypes} title={'border style'}></SelectArrayFor>
                    <BlurEnterTextInputFor name={'borderColor'} placeholder={'border color'}
                                           title={'border color'}></BlurEnterTextInputFor>


                    <div className={styles.header}>shadow</div>
                    <CheckboxFor className={styles.checkbox} name={'shadowInset'} text={'inset'}/>
                    <BlurEnterTextInputFor
                        name={'shadowXYOffset'}
                        title={'shadow offset'}
                        placeholder={'shadow offset'}
                    />
                    <NumberDragPointerLockFor name={'shadowBlur'} min={0}>
                        <BlurEnterNumberInputFor name={'shadowBlur'}

                                                 title={'shadow blur'}
                                                 placeholder={'shadow blur'}
                        />
                    </NumberDragPointerLockFor>
                    <NumberDragPointerLockFor name={'shadowSpread'} min={0}>
                        <BlurEnterNumberInputFor name={'shadowSpread'}
                                                 title={'shadow spread'}
                                                 placeholder={'shadow spread'}></BlurEnterNumberInputFor>
                    </NumberDragPointerLockFor>

                    <BlurEnterTextInputFor name={'shadowColor'} placeholder={'shadow color'}
                                           title={'shadow color'}></BlurEnterTextInputFor>


                    <div className={styles.header}>text</div>
                    <BlurEnterTextInputFor
                        name={'text'} placeholder={'text'}
                        title={'text'}
                    />
                    <BlurEnterTextInputFor
                        name={'textPosition'}
                        title={'text position'}
                        placeholder={'text position'}
                    />
                    <BlurEnterTextInputFor
                        name={'fontSize'} placeholder={'font size'}
                        title={'font size'}></BlurEnterTextInputFor>
                    <FontSelectFor className={styles.fontSelector} name={'fontId'} title={'font'} placeholder={'font'}/>
                    <BlurEnterTextInputFor
                        name={'textColour'} placeholder={'text color'} title={'text color'}/>


                    <div className={styles.header}>text shadow</div>
                    <BlurEnterTextInputFor
                        name={'textShadowXYOffset'}
                        placeholder={'text shadow offset'} title={'text shadow offset'}
                    ></BlurEnterTextInputFor>

                    <NumberDragPointerLockFor name={'textShadowBlur'} min={0}>
                        <BlurEnterNumberInputFor name={'textShadowBlur'}

                                                 placeholder={'text shadow blur'} title={'text shadow blur'}
                        />
                    </NumberDragPointerLockFor>
                    <BlurEnterTextInputFor
                        name={'textShadowColor'} placeholder={'text shadow color'}
                        title={'text shadow color'}
                    ></BlurEnterTextInputFor>

                </For>
            )}
            <div
                style={style}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
            >
                {randomColor && 'rand'}
            </div>
        </div>
    );
}

