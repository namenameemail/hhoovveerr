import styles from './styles.module.css';
import cn from 'classnames';
import { useSelector } from "react-redux";
import { selectTreeRoot, selectTreeRootId } from "../../store/currentProject/tree";
import { DivTreeNode } from "./DivTreeNode";
import { useEditorSelector } from "../../store";
import { getDivSizeById } from "../EditDiv/refService";

export interface DivTreeProps {
    className?: string;
}

export function DivTree(props: DivTreeProps) {

    const rootId = useEditorSelector(selectTreeRootId);

    const { className } = props;

    return (
        <div className={cn(styles.divTree, className)}>
            <div className={styles.sub}>
                <DivTreeNode isRoot id={rootId}/>
            </div>
        </div>
    );
}

