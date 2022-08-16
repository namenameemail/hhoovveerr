import { DivDragHandler, DragEvent, } from 'bbuutoonnss';
import React, { RefCallback, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DivParameters, DivState, SizeUnit, Vec } from "../../store/divTree/types";
import { useSelector } from "react-redux";
import { updateDiv, updateDivParameters } from "../../store/divTree";
import { selectEditorParams } from "../../store/editorParams";
import { ChildrenForm } from "./ChildrenForm";
import { selectActivePath } from "../../store/activePath";
import { useEditorDispatch, useEditorSelector } from "../../store";
import { DivStyles, getStyles } from "./configureStyles";
import { selectImages } from "../../store/assets";
import { DivForm } from "../DivForm/DivForm";
import styles from "./styles.module.css";
import { refService } from "./refService";


export interface EditDivProps extends Omit<React.HTMLProps<HTMLDivElement>, 'size' | 'onChange'> {
    parentDivRef?: RefObject<HTMLDivElement>;
    isRoot?: boolean;
    index?: number; // dprec
    state: DivState;
    parentAngle?: number;
    path?: string;
    parentDiv?: DivState;
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
        parentDiv,
        index,
        parentAngle = 0,
        isParentActivePath,
        isGrandParentActivePath,
        path = '',
        onChange,
        onSizeChange,
        ...rest
    } = props;


    const divRef = useRef<HTMLDivElement | null>(null);
    // isRoot && console.log('EditDiv', state.children.length);

    const setDivRef: RefCallback<HTMLDivElement> = useCallback((node) => {
        divRef.current = node;
        refService.registerRef(path, divRef, parentAngle)
    }, [divRef, path, parentAngle]);

    useEffect(() => {
        refService.registerRef(path, divRef, parentAngle)
    }, [divRef, path, parentAngle])

    const activePath = useSelector(selectActivePath);
    const dispatch = useEditorDispatch();

    const isActiveLeaf = isRoot ? !activePath : path === activePath;
    const isActivePath = isRoot
        ? true
        : (!path || (path.length <= activePath.length && (activePath.startsWith(path))));


    const {
        parameters: {
            color, size, startPoint, angle, text,
            // relativeStartX, relativeSizeX, relativeStartY, relativeSizeY
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
    const handleDivParamsChange = useCallback((divParams: DivParameters, name?: string, isIntermediate?: boolean) => {
        dispatch(updateDivParameters({ path, divParams, nohistory: isIntermediate }));
    }, [path, state]);

    const handleDivSizeChange = useCallback(({ x, y, isDragEnd }: DragEvent, e: MouseEvent, savedSize?: Vec) => {

        if (savedSize === undefined) {
            return;
        }

        // const viewSize: Vec = [window.innerWidth, window.innerHeight];
        const rootSize: Vec = [refService.refs[''].ref.current?.offsetWidth || 0, refService.refs[''].ref.current?.offsetHeight || 0];

        const getValueChange: { [key: string]: (value: number, parentSize: number, viewSize: Vec) => number } = {
            ['px']: (size: number, parentSize: number, viewSize: Vec) => (size),
            ['%']: (size: number, parentSize: number, viewSize: Vec) => size / parentSize * 100,

            ['vw']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[0] * 100),
            ['vh']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[1] * 100),
        };


        const { borderWidth: parentBorderWidth = 0 } = parentDiv?.parameters || {};
        const parentSize: Vec = parentDivRef?.current
            ? [parentDivRef.current.offsetWidth - 2 * parentBorderWidth, parentDivRef.current.offsetHeight - 2 * parentBorderWidth]
            : rootSize;

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...state.parameters,
                size: [
                    Math.max(0, savedSize[0] + getValueChange[state.parameters.sizeXUnit](x, parentSize[0], rootSize)),
                    Math.max(0, savedSize[1] + getValueChange[state.parameters.sizeYUnit](y, parentSize[1], rootSize)),
                ]
            },
            nohistory: !isDragEnd
        }));
    }, [path, index, state, parentDivRef, parentDiv]);

    const handleDivShadowXYOffsetChange = useCallback(({
                                                           x,
                                                           y,
                                                           isDragEnd
                                                       }: DragEvent, e: MouseEvent, savedSize?: Vec) => {
        if (savedSize === undefined) {
            return;
        }


        dispatch(updateDivParameters({
            path,
            divParams: {
                ...state.parameters,
                shadowXYOffset: [
                    savedSize[0] + x,
                    savedSize[1] + y
                ]
            },
            nohistory: !isDragEnd
        }));
    }, [path, index, state, parentDivRef, parentDiv]);


    const handleDivStartPointChange = useCallback((event: DragEvent, e: MouseEvent, savedStart?: Vec) => {

        if (savedStart === undefined) {
            return;
        }

        const { x, y, isDragStart, isDragEnd } = event;
        // const viewSize: Vec = [window.innerWidth, window.innerHeight];
        const rootSize: Vec = [refService.refs[''].ref.current?.offsetWidth || 0, refService.refs[''].ref.current?.offsetHeight || 0];

        const getValueChange: { [key: string]: (value: number, parentSize: number, viewSize: Vec) => number } = {
            ['px']: (size: number, parentSize: number, viewSize: Vec) => (size),
            ['%']: (size: number, parentSize: number, viewSize: Vec) => size / parentSize * 100,

            ['vw']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[0] * 100),
            ['vh']: (size: number, parentSize: number, viewSize: Vec) => (size / viewSize[1] * 100),
        };


        const { borderWidth = 0 } = parentDiv?.parameters || {};
        const parentSize: Vec = parentDivRef?.current
            ? [parentDivRef.current.offsetWidth - 2 * borderWidth, parentDivRef.current.offsetHeight - 2 * borderWidth]
            : rootSize;

        dispatch(updateDivParameters({
            path,
            divParams: {
                ...state.parameters,
                startPoint: [
                    savedStart[0] + getValueChange[state.parameters.startXUnit](x, parentSize[0], rootSize),
                    savedStart[1] + getValueChange[state.parameters.startYUnit](y, parentSize[1], rootSize)
                ]
            },
            nohistory: !isDragEnd,
        }));
    }, [path, index, state, parentDivRef, parentDiv]);


    const images = useEditorSelector(selectImages);
    const [divStyles, setDivStyles] = useState<DivStyles | null>(null);



    const resizeHandler = useCallback(() => {
        const rootSize: Vec = [refService.refs['']?.ref.current?.offsetWidth || 0, refService.refs['']?.ref.current?.offsetHeight || 0];
        setDivStyles(getStyles(state.parameters, true, images, rootSize, isRoot))
    }, [state.parameters, images, isRoot])

    useEffect(() => {
        resizeHandler()
        window.addEventListener('resize', resizeHandler)
        return () => {
            window.removeEventListener('resize', resizeHandler)
        }
    }, [resizeHandler])
    return (
        <div
            style={{
                ...divStyles?.origin,
                opacity,
            }}
            onMouseDown={handleMouseDown}
        >
            <DivDragHandler<Vec>
                className={styles.sizeHandler}
                angle={parentAngle}
                saveValue={state.parameters.size}
                onChange={handleDivSizeChange}
            />
            <DivDragHandler<Vec>
                className={styles.posHandler}
                angle={parentAngle}
                saveValue={state.parameters.startPoint}
                onChange={handleDivStartPointChange}
            />
            <div style={divStyles?.borderOrigin}></div>
            <div
                {...rest}
                ref={setDivRef}
                style={divStyles?.main}
                onMouseDown={handleMouseDown}
            >
                <div
                    style={divStyles?.text}>
                    {text}
                </div>
                {/*{parentAngle}*/}
                <ChildrenForm
                    parentRef={divRef}
                    isParentActiveLeaf={isActiveLeaf}
                    isParentActivePath={isActivePath}
                    isParentInactiveStart={isInactiveStart || false}
                    value={children}
                    style={divStyles?.children}
                    parentAngle={parentAngle + angle}
                    parentPath={isRoot ? undefined : path}
                >
                    {isActivePath && <div style={divStyles?.borderMain}></div>}
                    {isActiveLeaf && <div style={divStyles?.borderLeaf}></div>}
                    {!isActivePath && !isActiveLeaf && <div style={divStyles?.borderInactive}></div>}

                    {(isActivePath || !editorParams.hideInactivePath) && (
                        children.map((divState, childIndex) => {
                            return (
                                <EditDiv
                                    key={childIndex}
                                    parentDiv={state}
                                    state={divState}
                                    index={childIndex}
                                    path={path ? `${path}-${childIndex}` : `${childIndex}`}
                                    parentAngle={parentAngle + angle}
                                    isParentActivePath={isActivePath || false}
                                    isGrandParentActivePath={isParentActivePath || false}
                                    onChange={handleChildrenDivChange}
                                    parentDivRef={divRef}
                                />
                            );
                        })
                    )}
                </ChildrenForm>

            </div>

            {/*{isActiveLeaf && (*/}
            {/*    <DivForm*/}
            {/*        className={styles.form}*/}
            {/*        path={path}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
}

