import { Div, DivId, DivStyleParameters, SizeUnit, Vec } from "../../../../store/currentProject/tree/types";
import React, { CSSProperties, ReactNode, RefObject, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEditorParams } from "../../../../store/currentProject/editorParams";
import { addChildren, selectTreeRootId } from "../../../../store/currentProject/tree";
import cn from "classnames";
import styles from "./styles.module.css";
import { DragEvent, DragHandler, DragHandlerImperativeHandler, getRandomColor } from 'bbuutoonnss';
import { setActiveDiv } from "../../../../store/currentProject/tree";
import { getValueChangeByUnit } from "../../../../../components/inputs/Vec2NumberUnitDrag";
import { useEditorDispatch, useEditorSelector } from "../../../../store";
import { getInitialDivState } from "../../../../store/currentProject/tree/helpers/getInitialDivState";
import { useDivRefContext } from "../../../Preview/context/DivRefContext";

export interface ChildrenFormProps {
    isParentActivePath?: boolean;
    isParentActiveLeaf?: boolean;
    isParentInactiveStart?: boolean;
    className?: string;

    parentId: DivId;
    parentAngle: number;

    children?: ReactNode;
    parentRef: RefObject<HTMLElement>;
    style?: CSSProperties;
}

export function ChildrenForm(props: ChildrenFormProps) {

    const rootId = useEditorSelector(selectTreeRootId);
    const { refService } = useDivRefContext();
    const getRootSize = refService.getDivSizeById(rootId);


    const editorParams = useEditorSelector(selectEditorParams);
    const dispatch = useEditorDispatch();

    const dragHandlerRef = useRef<DragHandlerImperativeHandler>(null);

    const {
        children,
        className,
        parentId,
        parentAngle,
        isParentActivePath = true,
        isParentActiveLeaf,
        isParentInactiveStart,
        parentRef,
        style,
    } = props;

    const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
    const [size, setSize] = useState<[number, number] | null>(null);

    const handleDrag = useCallback((event: DragEvent, e: MouseEvent) => {

        e.stopPropagation()
        setSize([event.x, event.y]);
    }, []);

    const handleDragStart = useCallback((event: DragEvent, e: PointerEvent) => {
        e.stopPropagation()
        setStartPoint([e.offsetX, e.offsetY]);
        setSize([0, 0]);
        if (isParentActiveLeaf) {

        } else {
            dispatch(setActiveDiv(parentId));
        }
    }, [parentId, isParentActiveLeaf]);

    const handleDragEnd = useCallback((event: DragEvent, e: PointerEvent) => {
        if (!parentRef.current) {
            return;
        }
        const parentSize = [dragHandlerRef.current?.divRef.current?.offsetWidth || 0, dragHandlerRef.current?.divRef.current?.offsetHeight || 0];
        const rootSize: Vec = getRootSize();

        if (startPoint && size?.[0] && size?.[1]) {

            const absoluteStartPoint = [
                size[0] > 0 ? startPoint[0] : startPoint[0] + size[0],
                size[1] > 0 ? startPoint[1] : startPoint[1] + size[1],
            ];
            const absoluteSize = [
                size[0] > 0 ? size[0] : -size[0],
                size[1] > 0 ? size[1] : -size[1]
            ];
            const {
                color = '',
                // randomColor = false,
                borderColor = '',
                borderStyle = 'solid',
                borderWidth = [0, SizeUnit.px],
                ...restParams
            } = {} as DivStyleParameters;

            // const {
            //     startXUnit = SizeUnit.px,
            //     startYUnit = SizeUnit.px,
            //     sizeXUnit = SizeUnit.px,
            //     sizeYUnit = SizeUnit.px,
            // } = {
            //     startXUnit: sta
            // }

            dispatch(addChildren({
                id: parentId,
                divState: {
                    ...getInitialDivState(),
                    positionParameters: {
                        startPoint: [
                            [getValueChangeByUnit[SizeUnit.pc](absoluteStartPoint[0], parentSize[0], rootSize), SizeUnit.pc],
                            [getValueChangeByUnit[SizeUnit.pc](absoluteStartPoint[1], parentSize[1], rootSize), SizeUnit.pc],
                        ],
                        size: [
                            [getValueChangeByUnit[SizeUnit.pc](absoluteSize[0], parentSize[0], rootSize), SizeUnit.pc],
                            [getValueChangeByUnit[SizeUnit.pc](absoluteSize[1], parentSize[1], rootSize), SizeUnit.pc],
                        ],
                        // startPoint: [
                        //     [getValueChangeByUnit[startXUnit || SizeUnit.px](absoluteStartPoint[0], parentSize[0], rootSize), startXUnit || SizeUnit.px],
                        //     [getValueChangeByUnit[startYUnit || SizeUnit.px](absoluteStartPoint[1], parentSize[1], rootSize), startYUnit || SizeUnit.px],
                        // ],
                        // size: [
                        //     [getValueChangeByUnit[sizeXUnit || SizeUnit.px](absoluteSize[0], parentSize[0], rootSize), sizeXUnit || SizeUnit.px],
                        //     [getValueChangeByUnit[sizeYUnit || SizeUnit.px](absoluteSize[1], parentSize[1], rootSize), sizeYUnit || SizeUnit.px],
                        // ],
                        angle: 0,
                    },
                    styleParameters: {
                        color: '',
                        borderStyle,
                        borderWidth,
                        borderColor,
                        shadowInset: false,
                        shadowXYOffset: [[0, SizeUnit.px], [0, SizeUnit.px]],
                        shadowBlur: [0, SizeUnit.px],
                        shadowSpread: [0, SizeUnit.px],
                        // shadowColor: color || (randomColor && getRandomColor()) || '',
                        shadowColor: color || (true && getRandomColor()) || '',
                        ...restParams,
                    },
                    children: []
                }
            }));
        }

        setStartPoint(null);
        setSize(null);
    }, [startPoint, size, parentId, dragHandlerRef]);

    return (
        <DragHandler
            ref={dragHandlerRef}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={cn(styles.children, {
                [styles.isParentActivePath]: isParentActivePath,
                [styles.isParentActiveLeaf]: isParentActiveLeaf,
                [styles.isParentInactiveStart]: isParentInactiveStart,
            }, className)}
            angle={parentAngle}
            style={style}
        >
            {children}
            {startPoint && size && (
                <DivNew className={styles.newDiv} startPoint={startPoint} size={size}></DivNew>
            )}
        </DragHandler>
    );
}

export interface DivNewProps extends Omit<React.HTMLProps<HTMLDivElement>, 'size'> {
    startPoint: Vec,
    size: Vec
}

export function DivNew(props: DivNewProps) {
    const {
        startPoint,
        size,
        ...rest
    } = props;

    return (
        <div
            {...rest}
            style={{
                width: size[0] > 0 ? size[0] : -size[0],
                height: size[1] > 0 ? size[1] : -size[1],
                top: size[1] > 0 ? startPoint[1] : startPoint[1] + size[1],
                left: size[0] > 0 ? startPoint[0] : startPoint[0] + size[0],
            }}
        />
    );
}
