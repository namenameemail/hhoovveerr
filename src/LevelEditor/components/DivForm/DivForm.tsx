import cn from 'classnames';
import {
    CollectableParameters,
    DivBehaviorParameters,
    DivPositionParameters,
    DivStyleParameters, ReceivableCollectableParameters, ReceiverParameters,
    SizeUnit,
    Vec
} from "../../store/currentProject/tree/types";
import {
    BlurEnterNumberInputFor,
    BlurEnterTextInputFor,
    CheckboxFor,
    For,
    NumberDragPointerLockFor,
} from "../../../components/For";
import { SelectArrayFor } from "../../../components/For/components/SelectArrayFor";
import { blendModes, borderTypes, interactionEvent, sizeUnits } from "../../const";
import React, { useCallback } from "react";
import {
    deleteDiv,
    divDown,
    divUp,
    selectDivByIdWithParentAngle,
    selectTreeRootId,
    selectOrderPathById,
    selectParentDivById,
    updateDivStyleParameters,
    updateDivPositionParameters,
    updateDivBehaviorParameters,
    selectActiveDivId,
    selectIdsPathById
} from "../../store/currentProject/tree";
import { useEditorDispatch, useEditorSelector } from "../../store";

import { ImageSelectFor } from "../ImageSelect";
import { FontSelectFor } from "../FontSelect";
import styles from './styles.module.css';
import { NumberUnitDragPLInputFor } from "../../../components/For/components/NumberUnitDragPLInputFor";
import { Vec2NumberUnitInputDragFor } from "../../../components/inputs/Vec2NumberUnitInputDrag";
import { CollectableSelectFor } from "../CollectableSelect";
import { ViewDiv } from "../ViewDiv";
import { ReceivableForm } from "./ReceivableForm";
import { useDivRefContext } from "../Preview/context/DivRefContext";

export interface DivFormProps {
    className?: string;
    id: string;

}

const allUnits = Object.values(SizeUnit);
const pxUnit = [SizeUnit.px];
const shadowUnits = [SizeUnit.px, SizeUnit.vw, SizeUnit.vh];

export function DivForm(props: DivFormProps) {

    const { className, id } = props;
    const rootId = useEditorSelector(selectTreeRootId);

    const { refService } = useDivRefContext();
    const getRootSize = refService.getDivSizeById(rootId);

    const activeElementId = useEditorSelector(selectActiveDivId);
    const activePath = useEditorSelector(selectIdsPathById(activeElementId as string));

    const parentDiv = useEditorSelector(selectParentDivById(id));

    const { div: state, parentAngle } = useEditorSelector(selectDivByIdWithParentAngle(id));

    const path = useEditorSelector(selectOrderPathById(id));

    const styleParameters = state?.styleParameters || {} as DivStyleParameters;
    const positionParameters = state?.positionParameters || {} as DivPositionParameters;
    const behaviorParameters = state?.behaviorParameters || {} as DivBehaviorParameters; // чето сделать с приведением
    const { ref: parentDivRef } = refService.refs[state?.parent as string] || {};
    const { ref: currentDivRef } = refService.refs[state?.id as string] || {};

    const dispatch = useEditorDispatch();

    const handleDivStyleParamsChange = useCallback((params: DivStyleParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivStyleParameters({ id, params, nohistory: isIntermediate }));
    }, [id, styleParameters]);
    const handleDivPosParamsChange = useCallback((params: DivPositionParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivPositionParameters({ id, params, nohistory: isIntermediate }));
    }, [id, styleParameters]);
    const handleDivBehaveParamsChange = useCallback((params: DivBehaviorParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivBehaviorParameters({ id, params, nohistory: isIntermediate }));
    }, [id, styleParameters]);
    const handleCollectParamsChange = useCallback((collectableParameters: CollectableParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivBehaviorParameters({
            id,
            params: { ...behaviorParameters, collectableParameters },
            nohistory: isIntermediate
        }));
    }, [id, behaviorParameters]);

    const handleReceiverParamsChange = useCallback((receiverParameters: ReceiverParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivBehaviorParameters({
            id,
            params: { ...behaviorParameters, receiverParameters },
            nohistory: isIntermediate
        }));
    }, [id, behaviorParameters]);

    const getParentSize = parentDiv?.id ? refService.getDivSizeById(parentDiv.id) : getRootSize;

    const getCurrentSize = refService.getDivSizeById(id);
   
    const handleDelete = useCallback(() => {
        dispatch(deleteDiv({ id }));
    }, [id]);
    const handleUp = useCallback(() => {
        dispatch(divUp({ id }));
    }, [id]);
    const handleDown = useCallback(() => {
        dispatch(divDown({ id }));
    }, [id]);


    const isRoot = !state?.parent;
    return (
        <div className={cn(className, styles.divFormContainer)}>
            <div className={styles.path}>{path}</div>

            <For<DivPositionParameters>
                value={positionParameters}
                onChange={handleDivPosParamsChange}
                className={styles.divForm}
            >
                {!isRoot && (<>

                    <Vec2NumberUnitInputDragFor
                        angle={parentAngle}
                        units={allUnits}
                        autoResetUnitTo={SizeUnit.px}
                        name={'startPoint'}
                        text={'start point'}
                        getRootSize={getRootSize}
                        getParentSize={getParentSize}
                        separator={' '}
                    />

                    <Vec2NumberUnitInputDragFor
                        angle={parentAngle}
                        units={allUnits}
                        autoResetUnitTo={SizeUnit.px}
                        name={'size'}
                        text={'size'}
                        getRootSize={getRootSize}
                        getParentSize={getParentSize}
                        separator={' '}
                    />

                    <NumberDragPointerLockFor name={'angle'} min={0}>
                        <BlurEnterNumberInputFor name={'angle'} title={'angle'}
                                                 placeholder={'angle'}></BlurEnterNumberInputFor>
                    </NumberDragPointerLockFor>


                </>)}
            </For>

            <For<DivBehaviorParameters>
                value={behaviorParameters}
                onChange={handleDivBehaveParamsChange}
                className={styles.divForm}
            >
                <CheckboxFor className={styles.checkbox} name={'isOpen'} text={'open'}/>
                <CheckboxFor className={styles.checkbox} name={'stopClickPropagation'} text={'stopClickPropagation'}/>


                {!behaviorParameters.isOpen && (<>
                    <SelectArrayFor name={'openEvent'} options={interactionEvent} title={'open event'}/>
                    <SelectArrayFor name={'closeEvent'} options={interactionEvent} title={'close event'}/>
                </>)}

                <div className={styles.header}>collectable</div>
                <CheckboxFor className={styles.checkbox} name={'isCollectable'} text={' collectable'}/>
                {behaviorParameters.isCollectable && (
                    <For<CollectableParameters>
                        value={behaviorParameters.collectableParameters}
                        onChange={handleCollectParamsChange}
                        className={styles.divForm}
                    >
                        <SelectArrayFor name={'collectEvent'} options={interactionEvent} title={'collect event'}/>
                        <Vec2NumberUnitInputDragFor
                            angle={parentAngle}
                            units={allUnits}
                            autoResetUnitTo={SizeUnit.px}
                            name={'inventorySize'}
                            text={'inventorySize'}
                            getRootSize={getRootSize}
                            getParentSize={getParentSize}
                            separator={' '}
                        />
                        <BlurEnterTextInputFor name={'name'}/>
                    </For>)}


                <ReceivableForm id={id}/>

            </For>

            <For<DivStyleParameters>
                value={styleParameters}
                onChange={handleDivStyleParamsChange}
                className={styles.divForm}
            >

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


                {!isRoot && (<>
                    <div className={styles.header}>border</div>
                    <NumberUnitDragPLInputFor
                        units={pxUnit}
                        name={'borderWidth'}
                        min={0}
                        text={'border width'}
                        autoResetUnitTo={SizeUnit.px}
                    />
                    <NumberUnitDragPLInputFor
                        units={allUnits}
                        min={0}
                        name={'borderRadius'}
                        text={'border radius'}
                        autoResetUnitTo={SizeUnit.px}
                    />

                    <SelectArrayFor name={'borderStyle'} options={borderTypes} title={'border style'}></SelectArrayFor>
                    <BlurEnterTextInputFor name={'borderColor'} placeholder={'border color'}
                                           title={'border color'}></BlurEnterTextInputFor>

                </>)}

                <div className={styles.header}>shadow</div>
                <CheckboxFor className={styles.checkbox} name={'shadowInset'} text={'inset'}/>


                <Vec2NumberUnitInputDragFor
                    angle={parentAngle + positionParameters.angle}
                    units={shadowUnits}
                    // autoResetUnitTo={SizeUnit.px}
                    name={'shadowXYOffset'}
                    title={'shadow offset'}
                    placeholder={'shadow offset'}
                    getRootSize={getRootSize}
                    getParentSize={getCurrentSize}
                    separator={' '}
                />

                <NumberUnitDragPLInputFor
                    units={shadowUnits}
                    name={'shadowBlur'}
                    text={'shadow blur'}
                    autoResetUnitTo={SizeUnit.px}
                />
                <NumberUnitDragPLInputFor
                    units={shadowUnits}
                    name={'shadowSpread'}
                    text={'shadow spread'}
                    autoResetUnitTo={SizeUnit.px}
                />

                <BlurEnterTextInputFor name={'shadowColor'} placeholder={'shadow color'}
                                       title={'shadow color'}></BlurEnterTextInputFor>


                <div className={styles.header}>text</div>
                <BlurEnterTextInputFor name={'text'} placeholder={'text'}
                                       title={'text'}/>

                <Vec2NumberUnitInputDragFor
                    angle={parentAngle + positionParameters.angle}
                    units={allUnits}
                    // autoResetUnitTo={SizeUnit.px}
                    name={'textPosition'}
                    title={'text position'}
                    placeholder={'text position'}
                    getRootSize={getRootSize}
                    getParentSize={getCurrentSize}
                    separator={' '}
                />
                <NumberUnitDragPLInputFor
                    units={allUnits}
                    name={'fontSize'}
                    text={'font size'}
                    autoResetUnitTo={SizeUnit.px}
                />

                <FontSelectFor className={styles.fontSelector} name={'fontId'} title={'font'} placeholder={'font'}/>
                <BlurEnterTextInputFor
                    name={'textColour'} placeholder={'text color'} title={'text color'}/>


                <div className={styles.header}>text shadow</div>

                <Vec2NumberUnitInputDragFor
                    angle={parentAngle + positionParameters.angle}
                    units={shadowUnits}
                    // autoResetUnitTo={SizeUnit.px}
                    name={'textShadowXYOffset'}
                    title={'text shadow offset'}
                    placeholder={'text shadow offset'}
                    getRootSize={getRootSize}
                    getParentSize={getCurrentSize}
                    separator={' '}
                />
                <NumberUnitDragPLInputFor
                    units={shadowUnits}
                    name={'textShadowBlur'}
                    min={0}
                    placeholder={'text shadow blur'}
                    title={'text shadow blur'}
                    autoResetUnitTo={SizeUnit.px}
                />


                <BlurEnterTextInputFor
                    name={'textShadowColor'}
                    placeholder={'text shadow color'}
                    title={'text shadow color'}
                ></BlurEnterTextInputFor>

                {!isRoot && (
                    <div className={styles.buttons}>
                        <button onClick={handleDelete}>delete</button>
                        <button onClick={handleDown}>down</button>
                        <button onClick={handleUp}>up</button>
                    </div>
                )}

            </For>
        </div>
    );
}

