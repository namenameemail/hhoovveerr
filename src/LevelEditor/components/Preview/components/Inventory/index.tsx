import styles from './styles.module.css';
import cn from 'classnames';
import { useSelector } from "react-redux";
import { DivTreeNode } from "../../../DivTree/DivTreeNode";
import { selectCollectableIds, selectTreeRootId } from "../../../../store/currentProject/tree";
import React, { useCallback, useRef } from "react";
import { Div, DivId, SizeUnit, Vec } from "../../../../store/currentProject/tree/types";
import { useEditorDispatch, useEditorSelector } from "../../../../store";
import { ViewDiv } from "../../../ViewDiv";
import { refServiceView } from "../../refService";

export interface InventoryProps {
    className?: string;
    activePath: DivId[]
}

export function Inventory(props: InventoryProps) {

    const rootId = useEditorSelector(selectTreeRootId);
    const getRootSize = refServiceView.getDivSizeById(rootId)

    const dispatch = useEditorDispatch();
    const collectableIds = useSelector(selectCollectableIds);

    const { className, activePath } = props;

    const divRef = useRef<HTMLDivElement | null>(null);
    //
    // console.log(collectableIds);

    // const handleChildrenDivChange = useCallback((path: string, index: number, divState: DivState) => {
    //     dispatch(updateDiv({ path, divState }));
    // }, []);

    const getInventorySize = useCallback(() => {
        const rootSize: Vec = getRootSize();

        // const { borderWidth: parentBorderWidth = [0, SizeUnit.px] } = inventoryParameters;
        const parentSize: Vec = divRef?.current
            ? [divRef.current.offsetWidth, divRef.current.offsetHeight]
            : rootSize; // ?

        return parentSize;
    }, [divRef]);


    return (
        <div ref={divRef} className={cn(styles.inventory, className)}>
            {collectableIds.map((id, childIndex) => {
                return (
                    <ViewDiv
                        activePath={activePath}
                        isInventoryItem
                        key={childIndex}
                        id={id}
                    />

                );
            })}
        </div>
    );
}

// {/*<EditDiv*/}
// {/*    activePath={activePath}*/}
// {/*    isInventoryItem*/}
// {/*    key={childIndex}*/}
// {/*    id={id}*/}
// {/*    parentAngle={0}*/}
// {/*    isParentActivePath={false}*/}
// {/*    isGrandParentActivePath={false}*/}
// {/*    getParentSize={getInventorySize}*/}
// {/*/>*/}