import styles from './styles.module.css';
import cn from 'classnames';
import { useCallback } from "react";
import { useEditorDispatch, useEditorSelector } from "../../store";
import { Regime, selectCurrentRegime, setRegime } from "../../store/currentProject/currentRegime";
import { SelectArray } from "../../../components/inputs/SelectArray";

export interface RegimesProps {
    className?: string;
}

export function RegimeSelect(props: RegimesProps) {

    const { className } = props;

    const dispatch = useEditorDispatch();
    const currentRegime = useEditorSelector(selectCurrentRegime);

    const onRegimeSelect = useCallback((value: string) => {
        dispatch(setRegime(value as Regime));
    }, []);

    return (
        <div className={cn(styles.regimesBlock, className)}>
            <SelectArray
                value={currentRegime}
                name={'regime'}
                title={'regime'}
                options={Object.values(Regime)}
                onChange={onRegimeSelect}
            />
        </div>
    );
}

