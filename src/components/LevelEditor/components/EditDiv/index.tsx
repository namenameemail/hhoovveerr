import styles from '../../styles.module.css';
import cn from 'classnames';
import {
    getRandomColor,
    DivDragHandler,
    DragEvent,
} from 'bbuutoonnss';
import React, { ReactNode, RefObject, useCallback, useRef } from "react";
import { DivState, Vec } from "../../store/divTree/types";
import { useDispatch, useSelector } from "react-redux";
import {
    addChildren,
    changeColor, deleteDiv, divDown, divUp,
    updateDiv, updateDivParameters
} from "../../store/divTree";
import {
    DivParameters
} from "../../store/divTree/types";
import { selectEditorParams } from "../../store/editorParams";
import { ChildrenForm } from "./ChildrenForm";
import {
    BlurEnterTextInputFor,
    CheckboxFor,
    For,
    NumberDragFor,
    ObjectFor,
    Vec2DragFor,
    Vec2DragPointerLockFor
} from "../../../For";
import { selectActivePath } from "../../store/activePath";
import { useEditorDispatch } from "../../store";

export interface EditDivProps extends Omit<React.HTMLProps<HTMLDivElement>, 'size' | 'onChange'> {
    parentDivRef?: RefObject<HTMLDivElement>;
    isRoot?: boolean;
    index?: number; // dprec
    state: DivState;
    parentAngle?: number;
    path?: string;
    isParentActivePath?: boolean;
    isGrandParentActivePath?: boolean;
    onChange?: (path: string, index: number, state: DivState) => void;
    onSizeChange?: (path: string, index: number, size: Vec) => void;
}

export function EditDiv(props: EditDivProps) {
    const {
        parentDivRef,
        isRoot,
        state,
        index,
        parentAngle = 0,
        isParentActivePath,
        isGrandParentActivePath,
        path = '',
        onChange,
        onSizeChange,
        ...rest
    } = props;


    const divRef = useRef<HTMLDivElement>(null);
    // isRoot && console.log('EditDiv', state.children.length);

    const activePath = useSelector(selectActivePath);
    const dispatch = useEditorDispatch();

    const isActiveLeaf = isRoot ? !activePath : path === activePath;
    const isActivePath = isRoot
        ? true
        : (!path || (path.length <= activePath.length && (activePath.startsWith(path))));


    const {
        parameters: {
            color, size, startPoint, angle,
            relativeStartX, relativeSizeX, relativeStartY, relativeSizeY
        }, children
    } = state;

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();

        // dispatch(changeColor({ path: path || '', color: getRandomColor() }));
        // dispatch(setActivePath(path));
    }, [path]);


    const editorParams = useSelector(selectEditorParams);


    const isInactiveStart = isGrandParentActivePath && !isParentActivePath;

    const opacity = isInactiveStart ? editorParams.inactivePathOpacity : 1;


    const handleChildrenDivChange = useCallback((path: string, index: number, divState: DivState) => {
        dispatch(updateDiv({ path, divState }));
    }, []);
    const handleDivParamsChange = useCallback((divParams: DivParameters) => {
        dispatch(updateDivParameters({ path, divParams }));
    }, [path, state]);

    const handleDivSizeChange = useCallback((nohistory: boolean, { x, y }: DragEvent, e: MouseEvent, savedSize?: Vec) => {
        if (!parentDivRef?.current || savedSize === undefined) {
            return;
        }

        const parentSize: Vec = [parentDivRef.current.offsetWidth, parentDivRef.current.offsetHeight];

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...state.parameters,
                size: [
                    Math.max(0, savedSize[0] + x / parentSize[0] * 100),
                    Math.max(0, savedSize[1] + y / parentSize[1] * 100)
                ]
            },
            nohistory
        }));
    }, [path, index, state, parentDivRef]);
    const handleDivSizeChangeMove = useCallback((dragEvent: DragEvent, e: MouseEvent, savedSize?: Vec) => {
        handleDivSizeChange(true, dragEvent, e, savedSize);
    }, [handleDivSizeChange]);
    const handleDivSizeChangeUp = useCallback((dragEvent: DragEvent, e: MouseEvent, savedSize?: Vec) => {
        handleDivSizeChange(false, dragEvent, e, savedSize);
    }, [handleDivSizeChange]);



    const handleDivStartPointChange = useCallback((nohistory: boolean, { x, y }: DragEvent, e: MouseEvent, savedStart?: Vec) => {
        if (!parentDivRef?.current || savedStart === undefined) {
            return;
        }

        const parentSize: Vec = [parentDivRef.current.offsetWidth, parentDivRef.current.offsetHeight];


        dispatch(updateDivParameters({
            path,
            divParams: {
                ...state.parameters,
                startPoint: [
                    savedStart[0] + x / parentSize[0] * 100,
                    savedStart[1] + y / parentSize[1] * 100
                ]
            },
            nohistory
        }));
    }, [path, index, state, parentDivRef]);


    const handleDivStartPointChangeMove = useCallback((event: DragEvent, e: MouseEvent, savedStart?: Vec) => {
        handleDivStartPointChange(true, event, e, savedStart)
    }, [handleDivStartPointChange]);


    const handleDivStartPointChangeUp = useCallback((event: DragEvent, e: MouseEvent, savedStart?: Vec) => {
        handleDivStartPointChange(false, event, e, savedStart)
    }, [handleDivStartPointChange]);



    const handleDivAngleChange = useCallback(({ x, y }: DragEvent, e: MouseEvent, savedStart?: number) => {


        dispatch(updateDivParameters({
            path,
            divParams: {
                ...state.parameters,
                angle: Math.max(0, (savedStart || 0) - y)
            }
        }));
    }, [path, state]);

    const handleDelete = useCallback(() => {
        dispatch(deleteDiv({ path }));
    }, [path]);
    const handleUp = useCallback(() => {
        dispatch(divUp({ path }));
    }, [path]);
    const handleDown = useCallback(() => {
        dispatch(divDown({ path }));
    }, [path]);

    return (
        <div
            style={{
                width: size[0] + (relativeSizeX ? '%' : 'px'),
                height: size[1] + (relativeSizeY ? '%' : 'px'),
                left: startPoint[0] + (relativeStartX ? '%' : 'px'),
                top: startPoint[1] + (relativeStartY ? '%' : 'px'),
                border: '1px solid rgba(0, 0,0,.2)',
                opacity,
            }}
            onMouseDown={handleMouseDown}
        >
            <DivDragHandler<Vec>
                style={{
                    position: 'absolute',
                    width: '16px',
                    height: '16px',
                    right: '-8px',
                    bottom: '-8px',
                    background: 'transparent',
                    // border: '1px solid rgba(0, 0,0,.4)',
                    cursor: 'nwse-resize'
                }}
                angle={parentAngle}
                saveValue={state.parameters.size}
                onDrag={handleDivSizeChangeMove}
                onDragEnd={handleDivSizeChangeUp}
            />
            <DivDragHandler<Vec>
                style={{
                    position: 'absolute',
                    width: '16px',
                    height: '16px',
                    top: '-8px',
                    left: '-8px',
                    background: 'transparent',
                    // border: '1px solid rgba(0, 0,0,.4)',
                    cursor: 'move'
                }}
                angle={parentAngle}
                saveValue={state.parameters.startPoint}
                onDrag={handleDivStartPointChangeMove}
                onDragEnd={handleDivStartPointChangeUp}
            />
            <div
                {...rest}
                ref={divRef}
                style={{
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                    background: color,
                    transform: `rotate(${angle}deg)`
                }}
                onMouseDown={handleMouseDown}
            >
                {/*{opacity}*/}
                <ChildrenForm
                    isParentActiveLeaf={isActiveLeaf}
                    isParentActivePath={isActivePath}
                    isParentInactiveStart={isInactiveStart || false}
                    value={children}
                    parentAngle={parentAngle + angle}
                    parentPath={isRoot ? undefined : path}
                >
                    {(isActivePath || !editorParams.hideInactivePath) && (
                        children.map((divState, childIndex) => {
                            return (
                                <EditDiv
                                    state={divState}
                                    index={childIndex}
                                    path={path ? `${path}-${childIndex}` : `${childIndex}`}
                                    parentAngle={parentAngle + angle}
                                    isParentActivePath={isActivePath || false}
                                    isGrandParentActivePath={isParentActivePath || false}
                                    onChange={handleChildrenDivChange}
                                    parentDivRef={divRef}
                                    // onSizeChange={handleChildrenDivSizeChange}
                                />
                            );
                        })
                    )}
                </ChildrenForm>

            </div>
            {isActiveLeaf && (
                <For<DivParameters>
                    value={state.parameters}
                    onChange={handleDivParamsChange}
                >
                    <BlurEnterTextInputFor name={'color'}></BlurEnterTextInputFor>
                    <NumberDragFor name={'angle'} min={0}></NumberDragFor>
                    <Vec2DragFor name={'size'}></Vec2DragFor>
                    {/*<Vec2DragPointerLockFor name={'size'}></Vec2DragPointerLockFor>*/}
                    <CheckboxFor name={'relativeSizeX'}></CheckboxFor>
                    <CheckboxFor name={'relativeSizeY'}></CheckboxFor>
                    <CheckboxFor name={'relativeStartX'}></CheckboxFor>
                    <CheckboxFor name={'relativeStartY'}></CheckboxFor>
                    <button onClick={handleDelete}>delete</button>
                    <button onClick={handleDown}>down</button>
                    <button onClick={handleUp}>up</button>
                </For>
            )}
        </div>
    );
}

