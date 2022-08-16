import styles from './styles.module.css';
import cn from 'classnames';
import { useSelector } from "react-redux";
import { selectDivTreeRoot } from "../../store/divTree";
import { DivTreeNode } from "./DivTreeNode";

export interface DivTreeProps {
    className?: string;
}

export function DivTree(props: DivTreeProps) {


    const root = useSelector(selectDivTreeRoot);

    const { className } = props;

    return (
        <div className={cn(styles.divTree, className)}>
            <DivTreeNode isRoot state={root}/>
        </div>
    );
}

