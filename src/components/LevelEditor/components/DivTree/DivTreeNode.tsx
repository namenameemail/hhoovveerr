import styles from './styles.module.css';
import cn from 'classnames';
import { DivState } from "../../store/divTree/types";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActivePath, setActivePath } from "../../store/activePath";

export interface DivTreeNodeProps {
    className?: string;
    parentPath?: string;
    index?: number;
    state: DivState;
    hideChildren?: boolean;
    isRoot?: boolean;
}

export function DivTreeNode(props: DivTreeNodeProps) {

    const [isOpen, setIsOpen] = useState(true);
    const { isRoot, className, state, parentPath, index: nodeIndex, hideChildren } = props;

    const path = `${parentPath ? (parentPath + '-') : ''}${nodeIndex !== undefined ? nodeIndex : ''}`

    const activePath = useSelector(selectActivePath);
    const isActiveLeaf = path === activePath;

    const dispatch = useDispatch();
    const handleNodeClick = useCallback(() => {
        dispatch(setActivePath(path));
    }, [path]);
    const handleToggleIsOpen = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    const haveChildren = !!state.children.length;
    return (
        <div className={cn(styles.divTreeNodeContainer, {[styles.isActiveLeaf]: isActiveLeaf}, className)}>
            {/*{path}*/}
            <div
                className={styles.divTreeNode}
                style={{ background: state.parameters.color }}

            >
                <div className={styles.divTreeNodeName} onClick={handleNodeClick}>
                    {/*{path || 'root'}*/}
                    {isRoot ? 'root' : nodeIndex}
                </div>
                {haveChildren && !hideChildren && (<button onClick={handleToggleIsOpen}>{!isOpen ? '>' : '^'}</button>)}

            </div>

            {haveChildren && (
                <div className={cn(styles.divChildren)}>
                    {!hideChildren ? (
                        state.children.map((div, childrenIndex) => {
                            return (
                                <DivTreeNode
                                    key={childrenIndex}
                                    hideChildren={!isOpen}
                                    index={childrenIndex}
                                    parentPath={path}
                                    state={div}
                                />
                            );
                        })
                    ) : ('')}

                </div>
            )}
        </div>
    );
}

