import styles from './styles.module.css';
import cn from 'classnames';
import { BlurEnterTextInput } from 'bbuutoonnss';
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useEditorDispatch, useEditorSelector } from "../../store";
// @ts-ignore
import { saveAs } from 'file-saver';
import { forField } from "../../../components/For/hoc/forField";
import { useReadAssets } from "../Assets/hooks/useReadAssets";
import { EditDiv } from "../EditDiv";
import { refService } from "./refService";
import { selectActiveDivId, selectIdsPathById, selectTreeRootId } from "../../store/currentProject/tree";
import { selectEditorParams } from "../../store/currentProject/editorParams";
import { DivRefProvider } from "../Preview/context/DivRefContext";

export interface EditorCanvasProps {

}

export function EditorCanvas(props: EditorCanvasProps) {

    const activeElementId = useEditorSelector(selectActiveDivId);
    const activePath = useEditorSelector(selectIdsPathById(activeElementId as string));
    const rootId = useEditorSelector(selectTreeRootId);
    const editorParams = useEditorSelector(selectEditorParams);

    return (
        <EditDiv
            id={rootId}
            isRoot
            className={cn({ [styles.hidden]: editorParams.view })}
            getParentSize={refService.getDivSizeById(rootId)}
            activePath={activePath}
        />
    );
}
