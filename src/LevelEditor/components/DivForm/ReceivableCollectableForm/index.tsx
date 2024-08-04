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
    selectIdsPathById, selectReceivableCollectableParams, selectDivById, updateDivReceivableCollectableParameters
} from "../../../store/currentProject/tree";
import { useEditorDispatch, useEditorSelector } from "../../../store";
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

    const { refService } = useDivRefContext();
    
    const getRootSize = refService.getDivSizeById(rootId);
    const getCurrentSize = refService.getDivSizeById(id);

    const currentDiv = useEditorSelector(selectDivById(id));
    const activeElementId = useEditorSelector(selectActiveDivId);
    const activePath = useEditorSelector(selectIdsPathById(activeElementId as string));

    const parentDiv = useEditorSelector(selectParentDivById(id));

    
    // const getParentSize = parentDiv?.id ? refService.getDivSizeById(parentDiv.id) : getRootSize;

    const parameters = useEditorSelector(selectReceivableCollectableParams(id, collectableId));
    const { div: state, parentAngle } = useEditorSelector(selectDivByIdWithParentAngle(collectableId));

    const path = useEditorSelector(selectOrderPathById(id));

    const styleParameters = state?.styleParameters || {} as DivStyleParameters;
    const positionParameters = state?.positionParameters || {} as DivPositionParameters;
    const behaviorParameters = state?.behaviorParameters || {} as DivBehaviorParameters; // чето сделать с приведением

    const dispatch = useEditorDispatch();

    const handleParamsChange = useCallback((params: ReceivableCollectableParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivReceivableCollectableParameters({ id, collectableId, params, nohistory: isIntermediate }));
    }, [id, collectableId]);

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
                        angle={currentDiv.positionParameters.angle}
                        units={allUnits}
                        autoResetUnitTo={SizeUnit.pc}
                        name={'startPoint'}
                        text={'start point'}
                        getRootSize={getRootSize}
                        getParentSize={getCurrentSize}
                        separator={' '}
                    />

                    <Vec2NumberUnitInputDragFor
                        angle={currentDiv.positionParameters.angle}
                        units={allUnits}
                        autoResetUnitTo={SizeUnit.pc}
                        name={'size'}
                        text={'size'}
                        getRootSize={getRootSize}
                        getParentSize={getCurrentSize}
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

