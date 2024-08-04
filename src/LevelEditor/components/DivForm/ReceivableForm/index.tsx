import cn from 'classnames';
import {
    CollectableParameters,
    DivBehaviorParameters,
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
    updateDivBehaviorParameters,
    selectActiveDivId,
    selectIdsPathById, setDivReceivableCollectableInitialParameters, updateDivReceiverParameters
} from "../../../store/currentProject/tree";
import { useEditorDispatch, useEditorSelector } from "../../../store";
import { ImageSelectFor } from "../../ImageSelect";
import { FontSelectFor } from "../../FontSelect";
import styles from '../styles.module.css';
import { NumberUnitDragPLInputFor } from "../../../../components/For/components/NumberUnitDragPLInputFor";
import { Vec2NumberUnitInputDragFor } from "../../../../components/inputs/Vec2NumberUnitInputDrag";
import { CollectableSelectFor } from "../../CollectableSelect";
import { ViewDiv } from "../../ViewDiv";
import { ReceivableCollectableForm } from "../ReceivableCollectableForm";
import { useDivRefContext } from "../../Preview/context/DivRefContext";

export interface ReceivableFormProps {
    className?: string;
    id: string;

}


const allUnits = Object.values(SizeUnit);
const pxUnit = [SizeUnit.px];
const shadowUnits = [SizeUnit.px, SizeUnit.vw, SizeUnit.vh];

export function ReceivableForm(props: ReceivableFormProps) {

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
        console.log(666, receiverParameters)
        dispatch(updateDivReceiverParameters({
            id,
            params: receiverParameters,
            nohistory: isIntermediate
        }));
    }, [id]);


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

    const handleAdd = useCallback((collectableId: string) => {
        dispatch(setDivReceivableCollectableInitialParameters({ id, collectableId }));
    }, [id]);


    const isRoot = !state?.parent;
    return (
        <div className={cn(className, styles.divFormContainer)}>
            <div className={styles.header}>receiver</div>
            <CheckboxFor className={styles.checkbox} name={'isReceiver'} text={'receiver'}/>
            {
                behaviorParameters.receiverParameters.receivableCollectables?.map((divId) => {
                    return (
                        <ReceivableCollectableForm key={divId} collectableId={divId} id={id}/>
                    );
                })
            }
            {behaviorParameters.isReceiver && (
                <For<ReceiverParameters>
                    value={behaviorParameters.receiverParameters}
                    onChange={handleReceiverParamsChange}
                    className={cn(styles.divForm, styles.receiverForm)}
                >
                    1

                    <CollectableSelectFor onAdd={handleAdd} name={'receivableCollectables'}/>

                </For>)}
        </div>
    );
}

