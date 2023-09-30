import styles from './styles.module.css';
import cn from 'classnames';
import { CSSProperties, useCallback, useMemo, useState } from "react";
import { setActiveDiv } from "../../store/currentProject/tree";
import { getStyles } from "./configureStyles";
import { selectImages } from "../../store/currentProject/assets";
import { useEditorDispatch, useEditorSelector } from "../../store";
import { selectActiveDivId, selectDivById } from "../../store/currentProject/tree";

export interface DivTreeNodeProps {
    id: string;
    className?: string;
    parentPath?: string;
    index?: number;
    hideChildren?: boolean;
    isRoot?: boolean;
}

export function DivTreeNode(props: DivTreeNodeProps) {

    const [isOpen, setIsOpen] = useState(true);
    const { isRoot, className, id, parentPath, index: nodeIndex, hideChildren } = props;

    const state = useEditorSelector(selectDivById(id))


    const path = `${parentPath ? (parentPath + '-') : ''}${nodeIndex !== undefined ? nodeIndex : ''}`;

    const activeElementId = useEditorSelector(selectActiveDivId);
    const images = useEditorSelector(selectImages);
    const isActiveLeaf = id === activeElementId;

    const dispatch = useEditorDispatch();
    const handleNodeClick = useCallback(() => {
        dispatch(setActiveDiv(id));
    }, [id]);
    const handleToggleIsOpen = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const haveChildren = !!state?.children.length;


    const nodeStyles: CSSProperties = useMemo(() => {
        return state?.styleParameters ? getStyles(state?.styleParameters, images).main : {};
    }, [state, images]);
    return (
        <div className={cn(styles.divTreeNodeContainer, { [styles.isActiveLeaf]: isActiveLeaf }, className)}>
            {/*{path}*/}
            <div
                className={cn(styles.outlineBorder, { [styles.activeOutlineBorder]: isActiveLeaf })}>
                {/*{isActiveLeaf && <div className={styles.pointerText}>*/}

                {/*</div>}*/}
            </div>
            <div
                onClick={handleNodeClick}
                className={cn(styles.pointer, { [styles.activePointer]: isActiveLeaf })}>
                {/*{isActiveLeaf && <div className={styles.pointerText}>*/}

                {/*</div>}*/}

            </div>
            <div
                className={styles.divTreeNode}


            >
                <div className={styles.divTreeNodeName}>
                    {/*{path || 'root'}*/}
                    {isRoot ? 'r' : nodeIndex}
                    {/*{'_________'}*/}
                </div>

                <div  style={nodeStyles}>

                </div>
                {/*{haveChildren && !hideChildren && (<button onClick={handleToggleIsOpen}>{!isOpen ? '>' : '^'}</button>)}*/}

            </div>


            {haveChildren && (
                <div className={cn(styles.divChildren)}>
                    {!hideChildren ? (
                        state?.children.map((childrenId, childrenIndex) => {
                            return (
                                <DivTreeNode
                                    key={childrenIndex}
                                    hideChildren={!isOpen}
                                    index={childrenIndex}
                                    parentPath={path}
                                    id={childrenId}
                                />
                            );
                        })
                    ) : ('')}

                </div>
            )}


        </div>
    );
}

