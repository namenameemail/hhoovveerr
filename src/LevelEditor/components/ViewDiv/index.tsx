import React, { CSSProperties, RefObject, useCallback, useEffect, useMemo, useState } from "react";
import { Div, DivId, ReceivableCollectableParameters, Vec } from "../../store/currentProject/tree/types";
import { DivHover } from "../../../components/DivHover/DivHover";
import { getStyles, DivStyles } from "./helpers/configureStyles";
import { useEditorSelector } from "../../store";
import { selectFonts, selectImages } from "../../store/currentProject/assets";

import { selectActiveDivId, selectDivById, selectIdsPathById } from "../../store/currentProject/tree";
import { useViewContext, ViewContextValue } from "../Preview/context/ViewContext";
import { useDivRefRegistration } from "../../services/divRefService/hooks/useDivRefRegistration";
import { DivRefService } from "../../services/divRefService";
import { useDivRefContext } from "../Preview/context/DivRefContext";


export interface ViewDivProps {
    id: string;
    path?: string;
    isRoot?: boolean;
    isInventoryItem?: boolean;
    isSelectorItem?: boolean;
    isReceivedDiv?: boolean;
    receiveParameters?: ReceivableCollectableParameters;
    openActivePath?: boolean;
    onClick?: (id: string) => void;
    activePath: DivId[];
    cycledDivsIds?: DivId[];
}

export function ViewDiv(props: ViewDivProps) {
    const {
        id,
        isRoot,
        path = '',
        openActivePath,
        activePath,
        isInventoryItem,
        isSelectorItem,
        isReceivedDiv,
        receiveParameters,
        onClick,
        cycledDivsIds = [],
    } = props;

    const divRefContext = useDivRefContext();
    const viewContext = useViewContext();

    const isCycle = cycledDivsIds?.includes(id);

    const { refService: { current: refService } } = divRefContext;

    const state = useEditorSelector(selectDivById(id));

    const { styleParameters, children } = state;

    const images = useEditorSelector(selectImages);
    const fonts = useEditorSelector(selectFonts);
    const activeElementId = useEditorSelector(selectActiveDivId);

    const idPath = useEditorSelector(selectIdsPathById(id));

    const isActiveLeaf = id === activeElementId;
    const isActivePath = isRoot ? true : activePath.includes(id);

    const [divStyles, setDivStyles] = useState<DivStyles | null>(null);

    const resizeHandler = useCallback(() => {
        const rootSize: Vec = [refService?.refs['']?.ref.current?.offsetWidth || 0, refService?.refs['']?.ref.current?.offsetHeight || 0];
        setDivStyles(
            getStyles(
                {
                    styleParameters: state.styleParameters,
                    behaviourParameters: state.behaviourParameters,
                    positionParameters: state.positionParameters,
                    isBlendActive: true,
                    images,
                    fonts,
                    rootSize,
                    isRoot,
                    isInventoryItem,
                    isSelectorItem,
                    isReceivedDiv,
                    receiveParameters,
                }
            )
        );
    }, [state, images, fonts, isRoot, isInventoryItem, isSelectorItem, isReceivedDiv, receiveParameters]);

    useEffect(() => {
        resizeHandler();
        window.addEventListener('resize', resizeHandler);
        return () => {
            window.removeEventListener('resize', resizeHandler);
        };
    }, [resizeHandler]);

    const [divRef, setDivRef] = useDivRefRegistration(
        refService,
        id,
    refService?.refs[id]?.parentAngle || 0//??    parentAngle
    );

    return (
        <DivHover
            ref={setDivRef}
            id={id}
            open={(openActivePath ? isActivePath : false) || (state.behaviourParameters.isOpen && !isCycle)}
            // open={state.behaviourParameters.isOpen}
            style={divStyles?.main}
            openEvent={state.behaviourParameters.openEvent}
            closeEvent={state.behaviourParameters.closeEvent}
            collectEvent={state.behaviourParameters.collectableParameters.collectEvent}
            onCollect={viewContext.isActive ? (viewContext as ViewContextValue).onCollect : undefined}
            isReceiving={viewContext.isActive && !!(viewContext as ViewContextValue).state.currentActiveCollectableId}
            onReceive={viewContext.isActive ? (viewContext as ViewContextValue).onReceive : undefined}
            stopClickPropagation={state.behaviourParameters.stopClickPropagation && !isSelectorItem}
            onClick={onClick}
            path={path}
        >
            <div
                style={divStyles?.text}
            >
                {styleParameters.text}
            </div>
            {children.map((childId, childIndex) => {
                return (
                    <ViewDiv
                        cycledDivsIds={cycledDivsIds}
                        openActivePath={openActivePath}
                        activePath={activePath}
                        key={childIndex}
                        id={childId}
                        path={path ? `${path}-${childIndex}` : `${childIndex}`}
                    />
                );
            })}

            {/*// receivableCollectables*/}
            {state.behaviourParameters.receiverParameters.receivableCollectables.map((childId, childIndex) => {
                const isCycleStart = !cycledDivsIds?.includes(childId) && idPath.includes(childId);

                return (
                    <ViewDiv
                        cycledDivsIds={isCycleStart
                            ? [...(cycledDivsIds || []), childId]
                            : cycledDivsIds
                        }
                        isReceivedDiv
                        receiveParameters={state.behaviourParameters.receiverParameters.receivableCollectablesParameters[childId]}
                        openActivePath={openActivePath}
                        activePath={activePath}
                        key={childIndex}
                        id={childId}
                        path={path ? `${path}-${children.length + childIndex}` : `${children.length + childIndex}`}
                    />
                );
            })}
        </DivHover>
    );
}
