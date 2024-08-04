import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Div, DivId, ReceivableCollectableParameters, Vec } from "../../store/currentProject/tree/types";
import { DivHover } from "../../../components/DivHover/DivHover";
import { useEditorSelector } from "../../store";
import { selectFonts, selectImages } from "../../store/currentProject/assets";
import { selectActiveDivId, selectDivById, selectIdsPathById, selectTreeRootId } from "../../store/currentProject/tree";
import styles from "../Layout/regimes/Tree/styles.module.css";
import { ViewDiv } from "../ViewDiv";
import { selectEditorParams } from "../../store/currentProject/editorParams";
import { ViewProvider } from "./context/ViewContext";
import { DivRefService } from "../../services/divRefService";
import { DivRefProvider, useDivRefContext } from "./context/DivRefContext";


export interface PreviewProps {

}


export function Preview(props: PreviewProps) {


    const activeElementId = useEditorSelector(selectActiveDivId);
    const activePath = useEditorSelector(selectIdsPathById(activeElementId as string));
    const rootId = useEditorSelector(selectTreeRootId);
    const editorParams = useEditorSelector(selectEditorParams);


    return (
        <DivRefProvider>
            <ViewProvider>
                <ViewDiv
                    id={rootId}
                    isRoot
                    openActivePath={editorParams.openActivePath}
                    activePath={activePath}
                />
            </ViewProvider>
        </DivRefProvider>
    );
}
