import styles from '../../styles.module.css';
import cn from 'classnames';
import React, { CSSProperties, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectEditorParams } from "../../store/editorParams";
import { DivState } from "../../store/divTree/types";
import { DivHover } from "../../../DivHover/DivHover";
import { useDivStyle } from "../StyleDiv/useDivStyle";
import { getStyles } from "./configureStyles";
import { useEditorSelector } from "../../store";
import { selectImages } from "../../store/assets";


export interface ViewDivProps {
    state: DivState;

    isRoot?: boolean;
}

export function ViewDiv(props: ViewDivProps) {
    const {
        state,
        isRoot,
    } = props;


    const { parameters, children } = state;

    const images = useEditorSelector(selectImages)

    const divStyles = useMemo(() => getStyles(parameters, true, images), [state.parameters])

    const style = useMemo(() => {
        return {
            ...(isRoot ? ({
                position: 'relative',
            }) : ({
                position: 'absolute',
            })),
            ...divStyles.main,
        } as CSSProperties
    }, [divStyles, isRoot])


    return (
        <DivHover
            // open
            style={style}
        >
            {children.map((state, index) => {
                return <ViewDiv key={index} state={state}></ViewDiv>;
            })}
        </DivHover>
    );
}
