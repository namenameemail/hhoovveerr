import styles from '../../styles.module.css';
import cn from 'classnames';
import React, { CSSProperties, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEditorParams } from "../../store/editorParams";
import { DivState } from "../../store/divTree/types";
import { DivHover } from "../../../DivHover/DivHover";


export interface ViewDivProps {
    state: DivState;

    isRoot?: boolean;
}

export function ViewDiv(props: ViewDivProps) {
    const {
        state,
        isRoot,
    } = props;


    const { parameters: {
        color, size, startPoint, angle,
        relativeSizeX,
        relativeSizeY,
        relativeStartX,
        relativeStartY,
    }, children } = state;


    const editorParams = useSelector(selectEditorParams);

    //
    // const isInactiveStart = isGrandParentActivePath && !isParentActivePath

    // const opacity = isInactiveStart ? editorParams.inactivePathOpacity : 1

    return (
        <DivHover
            style={{
                width: size[0] + (relativeSizeX ? '%' : 'px'),
                height: size[1] + (relativeSizeY ? '%' : 'px'),
                left: startPoint[0] + (relativeStartX ? '%' : 'px'),
                top: startPoint[1] + (relativeStartY ? '%' : 'px'),
                background: color,
                ...(isRoot ? ({

                    position: 'relative',
                }) : ({
                    position: 'absolute',
                })),
                transform: `rotate(${angle}deg)`
                // opacity
            }}
        >
            {children.length}
            {children.map((state) => {
                return <ViewDiv state={state}></ViewDiv>;
            })}
        </DivHover>
    );
}
