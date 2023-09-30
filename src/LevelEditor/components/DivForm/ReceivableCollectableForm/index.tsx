import cn from 'classnames';
import {
    CollectableParameters,
    DivBehaviourParameters,
    DivPositionParameters,
    DivStyleParameters, ReceivableCollectableParameters, ReceiverParameters,
    SizeUnit,
    Vec
} from "../../../store/currentProject/tree/types";
import {
    BlurEnterNumberInputFor,
    BlurEnterTextInputFor,
    CheckboxFor,
    For,
    NumberDragPointerLockFor,
} from "../../../../components/For";
import { SelectArrayFor } from "../../../../components/For/components/SelectArrayFor";
import { blendModes, borderTypes, interactionEvent, sizeUnits } from "../../../const";
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
    updateDivBehaviourParameters,
    selectActiveDivId,
    selectIdsPathById, selectReceivableCollectableParams, selectDivById, updateDivReceivableCollectableParameters
} from "../../../store/currentProject/tree";
import { useEditorDispatch, useEditorSelector } from "../../../store";
// import { getDivSizeById, refService } from "../../EditDiv/refService";
import { ImageSelectFor } from "../../ImageSelect";
import { FontSelectFor } from "../../FontSelect";
import styles from '../styles.module.css';
import { NumberUnitDragPLInputFor } from "../../../../components/For/components/NumberUnitDragPLInputFor";
import { Vec2NumberUnitInputDragFor } from "../../../../components/inputs/Vec2NumberUnitInputDrag";
import { CollectableSelectFor } from "../../CollectableSelect";
import { ViewDiv } from "../../ViewDiv";
import { useDivRefContext } from "../../Preview/context/DivRefContext";

export interface ReceivableCollectableFormProps {
    className?: string;
    id: string;
    collectableId: string;

}

const allUnits = Object.values(SizeUnit);
const pxUnit = [SizeUnit.px];
const shadowUnits = [SizeUnit.px, SizeUnit.vw, SizeUnit.vh];

export function ReceivableCollectableForm(props: ReceivableCollectableFormProps) {

    const { className, id, collectableId } = props;
    const rootId = useEditorSelector(selectTreeRootId);

    const divRefContext = useDivRefContext();
    const { refService: { current: refService } } = divRefContext;
    const getRootSize = refService?.getDivSizeById(rootId) as () => Vec;

    const activeElementId = useEditorSelector(selectActiveDivId);
    const activePath = useEditorSelector(selectIdsPathById(activeElementId as string));

    const parentDiv = useEditorSelector(selectParentDivById(id));

    const parameters = useEditorSelector(selectReceivableCollectableParams(id, collectableId));
    const { div: state, parentAngle } = useEditorSelector(selectDivByIdWithParentAngle(collectableId));

    const path = useEditorSelector(selectOrderPathById(id));

    const styleParameters = state?.styleParameters || {} as DivStyleParameters;
    const positionParameters = state?.positionParameters || {} as DivPositionParameters;
    const behaviourParameters = state?.behaviourParameters || {} as DivBehaviourParameters; // чето сделать с приведением
    const { ref: parentDivRef } = refService?.refs[state?.parent as string] || {};
    const { ref: currentDivRef } = refService?.refs[state?.id as string] || {};

    const dispatch = useEditorDispatch();

    const handleParamsChange = useCallback((params: ReceivableCollectableParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivReceivableCollectableParameters({ id, collectableId, params, nohistory: isIntermediate }));
    }, [id, collectableId, styleParameters]);


    const handleDivPosParamsChange = useCallback((params: DivPositionParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivPositionParameters({ id, params, nohistory: isIntermediate }));
    }, [id, styleParameters]);
    const handleDivBehaveParamsChange = useCallback((params: DivBehaviourParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivBehaviourParameters({ id, params, nohistory: isIntermediate }));
    }, [id, styleParameters]);
    const handleCollectParamsChange = useCallback((collectableParameters: CollectableParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivBehaviourParameters({
            id,
            params: { ...behaviourParameters, collectableParameters },
            nohistory: isIntermediate
        }));
    }, [id, behaviourParameters]);

    const handleReceiverParamsChange = useCallback((receiverParameters: ReceiverParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivBehaviourParameters({
            id,
            params: { ...behaviourParameters, receiverParameters },
            nohistory: isIntermediate
        }));
    }, [id, behaviourParameters]);


    const getParentSize = useCallback(() => {
        const rootSize: Vec = getRootSize();

        const { borderWidth: parentBorderWidth = [0, SizeUnit.px] } = parentDiv?.styleParameters || {};
        const parentSize: Vec = parentDivRef?.current
            ? [parentDivRef.current.offsetWidth - 2 * parentBorderWidth[0], parentDivRef.current.offsetHeight - 2 * parentBorderWidth[0]]
            : rootSize;

        return parentSize;
    }, [parentDiv, parentDivRef]);

    const getCurrentSize = useCallback(() => {
        const rootSize: Vec = getRootSize();

        const { borderWidth: parentBorderWidth = [0, SizeUnit.px] } = styleParameters || {};
        const currentSize: Vec = currentDivRef?.current
            ? [currentDivRef.current.offsetWidth - 2 * parentBorderWidth[0], currentDivRef.current.offsetHeight - 2 * parentBorderWidth[0]]
            : rootSize;

        return currentSize;
    }, [styleParameters, currentDivRef]);

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
        <div>
            <ViewDiv
                isSelectorItem
                id={collectableId}
                activePath={activePath}
                // onClick={handleRemove}
            />
            {parameters && (
                <For<ReceivableCollectableParameters>
                    value={parameters}
                    onChange={handleParamsChange}
                >
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
                </For>
            )}
        </div>
    );
}

