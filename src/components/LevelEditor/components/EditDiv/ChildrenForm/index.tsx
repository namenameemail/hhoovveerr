import { DivState, SizeUnit, Vec } from "../../../store/divTree/types";
import React, { CSSProperties, ReactNode, RefObject, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEditorParams } from "../../../store/editorParams";
import { addChildren } from "../../../store/divTree";
import cn from "classnames";
import styles from "../../../styles.module.css";
import {
    DivDragHandler2 as DivDragHandler,
    DragEvent2 as DragEvent,
    getRandomColor,
    DivDragHandler2ImperativeHandler
} from 'bbuutoonnss';
import { setActivePath } from "../../../store/activePath";
import { selectCurrentBrush } from "../../../store/brushes";

export interface ChildrenFormProps {
    isParentActivePath?: boolean;
    isParentActiveLeaf?: boolean;
    isParentInactiveStart?: boolean;
    className?: string;

    parentPath?: string;
    parentAngle: number;

    value: DivState[];

    children?: ReactNode;
    parentRef: RefObject<HTMLElement>
    style?: CSSProperties
}

export function ChildrenForm(props: ChildrenFormProps) {

    const editorParams = useSelector(selectEditorParams);
    const currentBrush = useSelector(selectCurrentBrush);
    const dispatch = useDispatch();

    const divHoverRef = useRef<DivDragHandler2ImperativeHandler>(null);

    const {
        children,
        className,
        value,
        parentPath,
        parentAngle,
        isParentActivePath = true,
        isParentActiveLeaf,
        isParentInactiveStart,
        parentRef,
        style,
    } = props;

    const drawOnMouseDown = editorParams.draw;

    const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
    const [size, setSize] = useState<[number, number] | null>(null);

    const handleDrag = useCallback((event: DragEvent) => {
        setSize([event.x, event.y]);
    }, []);

    const handleDragStart = useCallback((event: DragEvent, e: MouseEvent) => {
        setStartPoint([e.offsetX, e.offsetY]);
        setSize([0, 0]);
        if (isParentActiveLeaf) {

        } else {
            dispatch(setActivePath(parentPath || ''));
        }
    }, [parentPath, drawOnMouseDown, isParentActiveLeaf]);

    const handleDragEnd = useCallback((event: DragEvent, e: MouseEvent) => {
        if (!parentRef.current) {
            return
        }
        const parentSize = [divHoverRef.current?.divRef.current.offsetWidth, divHoverRef.current?.divRef.current.offsetHeight];
        console.log(divHoverRef.current?.divRef.current.offsetWidth, divHoverRef.current?.divRef.current.offsetHeight )
        // const parentSize = [parentRef.current.offsetWidth, parentRef.current.offsetHeight];
        // console.log(parentRef.current.offsetWidth, parentRef.current.offsetHeight )

        if (startPoint && size?.[0] && size?.[1]) {
            const absoluteStartPoint = [
                size[0] > 0 ? startPoint[0] : startPoint[0] + size[0],
                size[1] > 0 ? startPoint[1] : startPoint[1] + size[1],
            ];
            const absoluteSize = [
                size[0] > 0 ? size[0] : -size[0],
                size[1] > 0 ? size[1] : -size[1]
            ];
            const {color, randomColor, borderColor, borderStyle = 'solid', borderWidth = 0} = currentBrush.brushStyleParameters || {}
            dispatch(addChildren({
                path: parentPath || '',
                divState: {
                    parameters: {
                        startPoint: [
                            absoluteStartPoint[0] / parentSize[0] * 100,
                            absoluteStartPoint[1] / parentSize[1] * 100,
                        ],
                        size: [
                            absoluteSize[0] / parentSize[0] * 100,
                            absoluteSize[1] / parentSize[1] * 100,
                        ],
                        angle: 0,
                        color: currentBrush.brushStyleParameters?.color || (currentBrush.brushStyleParameters?.randomColor && getRandomColor()) || '',
                        startXUnit: SizeUnit.pc,
                        startYUnit: SizeUnit.pc,
                        sizeXUnit: SizeUnit.pc,
                        sizeYUnit: SizeUnit.pc,
                        borderStyle,
                        borderWidth,
                        borderColor,
                        shadowInset: false,
                        shadowXYOffset: [0,0],
                        shadowBlur: 0,
                        shadowSpread: 0,
                        shadowColor: color || (randomColor && getRandomColor()) || '',
                    },
                    children: []
                }
            }));
        }

        setStartPoint(null);
        setSize(null);
    }, [startPoint, size, value, parentPath, divHoverRef]);

    return (
        <DivDragHandler
            ref={divHoverRef}
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
            css={''}
        >
            {children}
            {startPoint && size && (
                <DivNew className={styles.newDiv} startPoint={startPoint} size={size}></DivNew>
            )}
        </DivDragHandler>
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
