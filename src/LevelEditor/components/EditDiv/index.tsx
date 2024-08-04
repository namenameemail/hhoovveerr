import React, { useCallback } from "react";
import {
    DivStyleParameters,
    Div,
    DivId,
    SizeUnit,
    Vec,
    Vec2NumberUnit
} from "../../store/currentProject/tree/types";
import { useSelector } from "react-redux";
import {
    selectActiveDivId,
    selectDivById,
    selectTreeRootId, updateDivPositionParameters,
    updateDivStyleParameters
} from "../../store/currentProject/tree";
import { selectEditorParams } from "../../store/currentProject/editorParams";
import { ChildrenForm } from "./components/ChildrenForm";
import { useEditorDispatch, useEditorSelector } from "../../store";
import { DivStyles, getStyles } from "./helpers/configureStyles";
import { selectImages } from "../../store/currentProject/assets";
import styles from "./styles.module.css";
import { Inventory } from "./components/Inventory";
import { Vec2NumberUnitDrag } from "../../../components/inputs/Vec2NumberUnitDrag";
import { useDivStyles } from "./hooks/useDivStyles";
import { useDivRefRegistration } from "../../services/divRefService/hooks/useDivRefRegistration";
import { useDivRefContext } from "../Preview/context/DivRefContext";
import { ViewDiv } from "../ViewDiv/index";


export interface EditDivProps extends Omit<React.HTMLProps<HTMLDivElement>, 'size'> {
    id: string;
    activePath: DivId[];
    isRoot?: boolean;
    isInventoryItem?: boolean;
    parentAngle?: number;
    getParentSize: () => Vec;

    isParentActivePath?: boolean;
    isGrandParentActivePath?: boolean;
}

export function EditDiv(props: EditDivProps) {

    const {
        id,
        activePath,
        isRoot,
        isInventoryItem,
        getParentSize,
        parentAngle = 0,
        isParentActivePath,
        isGrandParentActivePath,
        ...rest
    } = props;

    const { refService } = useDivRefContext();

    const dispatch = useEditorDispatch();
    const rootId = useEditorSelector(selectTreeRootId);
    const activeElementId = useEditorSelector(selectActiveDivId);
    const editorParams = useSelector(selectEditorParams);
    const state = useEditorSelector(selectDivById(id));


    const [divRef, setDivRef] = useDivRefRegistration(refService, id, parentAngle);
    const divStyles = useDivStyles(state.positionParameters, state.styleParameters, state.behaviorParameters, isRoot, isInventoryItem);

    // console.log(id, state, divStyles)

    const isActiveLeaf = id === activeElementId;
    const isActivePath = isRoot ? true : activePath.includes(id);

    const isInactiveStart = isGrandParentActivePath && !isParentActivePath;
    const opacity = isInactiveStart ? editorParams.inactivePathOpacity : 1;


    const getRootSize = refService.getDivSizeById(rootId);

    const getSize = refService.getDivSizeById(id);

    const handleDivVec2ParameterChange = useCallback((value: Vec2NumberUnit, name?: string, isIntermediate?: boolean) => {
        name && dispatch(updateDivPositionParameters({
            id,
            params: {
                ...state.positionParameters,
                [name]: value
            },
            nohistory: isIntermediate
        }));
    }, [id, state]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {

        e.stopPropagation();

    }, []);

    return (
        <div
            style={{
                ...divStyles?.origin,
                opacity,
            }}
            onMouseDown={handleMouseDown}
        >
            {!isRoot && !isInventoryItem && (<>
                <Vec2NumberUnitDrag
                    name={'size'}
                    className={styles.sizeHandler}
                    angle={parentAngle}
                    value={state.positionParameters.size}
                    onChange={handleDivVec2ParameterChange}
                    pointerLock={false}
                    getParentSize={getParentSize}
                    getRootSize={getRootSize}
                />
                <Vec2NumberUnitDrag
                    name={'startPoint'}
                    className={styles.posHandler}
                    angle={parentAngle}
                    value={state.positionParameters.startPoint}
                    onChange={handleDivVec2ParameterChange}
                    pointerLock={false}
                    getParentSize={getParentSize}
                    getRootSize={getRootSize}
                />
            </>)}

            <div style={divStyles?.borderOrigin}></div>
            {isActiveLeaf && (
                <div style={divStyles?.pointerOrigin}></div>
            )}
            <div
                {...rest}
                ref={setDivRef}
                style={divStyles?.main}
                onMouseDown={handleMouseDown}
            >
                <div
                    style={divStyles?.text}>
                    {state.styleParameters.text}
                </div>

                <ChildrenForm
                    parentRef={divRef}
                    isParentActiveLeaf={isActiveLeaf}
                    isParentActivePath={isActivePath}
                    isParentInactiveStart={isInactiveStart || false}
                    style={divStyles?.children}
                    parentAngle={parentAngle + state.positionParameters.angle}
                    parentId={id}
                >
                    {isActivePath && <div style={divStyles?.borderMain}></div>}
                    {isActiveLeaf && <div style={divStyles?.borderLeaf}></div>}
                    {!isActivePath && !isActiveLeaf && <div style={divStyles?.borderInactive}></div>}

                    {(isActivePath || editorParams.showInactivePath || state.behaviorParameters.isOpen) && (
                        state.children.map((id, childIndex) => {
                            return (
                                <EditDiv
                                    key={childIndex}
                                    id={id}
                                    activePath={activePath}
                                    parentAngle={parentAngle + state.positionParameters.angle}
                                    isParentActivePath={isActivePath || false}
                                    isGrandParentActivePath={isParentActivePath || false}
                                    getParentSize={getSize}
                                />
                            );
                        })
                    )}
                </ChildrenForm>
                {state.behaviorParameters?.receiverParameters.receivableCollectables.map(divId => {
                    return (


                        <ViewDiv
                            key={divId}


                            isReceivedDiv
                            id={divId}
                            activePath={activePath}
                            receiveParameters={state.behaviorParameters.receiverParameters.receivableCollectablesParameters[divId]}
                        />
                    )
                })}
            </div>
            {isRoot && (
                <Inventory
                    activePath={activePath}/>
            )}
        </div>
    );
}

